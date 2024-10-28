const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const WebSocket = require('ws');
const bodyParser = require('body-parser');





const app = express();
app.use(cors());
app.use(bodyParser.json());

require('dotenv').config();


const uri = process.env.MONGODB_URI;
const dbName = process.env.DB;
const client = new MongoClient(uri);

let db;
let hierarchyCollection;
let sensorCollection;

const wss = new WebSocket.Server({ port: 8089 });

wss.on('listening', () => {
    console.log('WebSocket server is running on port 8089');
  });

  wss.on('error', (error) => {
    console.error('WebSocket server error:', error);
  });

  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket server');
  
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket server');
    });
  
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

async function initializeDatabase() {
  try {
    await client.connect();
    db = client.db(dbName);
    hierarchyCollection = db.collection('factory_hierarchy');
    sensorCollection = db.collection('sensor_data');

    const existingHierarchy = await hierarchyCollection.findOne({ _id: 'aircon-factory-01' });

    if (!existingHierarchy) {
      const hierarchyDocument = {
        _id: 'aircon-factory-01',
        enterprise: {
          id: 'aircon-factory-01',
          name: 'Aircon Factory',
          sites: [
            {
              id: 'assembly-site-01',
              name: 'Assembly Site 01',
              areas: [
                {
                  id: 'assembly-area-01',
                  name: 'Assembly Area 01',
                  lines: [
                    {
                      id: 'assembly-line-01',
                      name: 'Compressor Assembly Line',
                      work_centers: [
                        {
                          id: 'compressor-machine-01',
                          name: 'Compressor Machine 01',
                          status: 'running',
                          metrics: {
                            last_maintenance: '2024-10-15T08:00:00Z',
                            temperature: 70,
                            pressure: 120,
                          },
                        },
                        {
                          id: 'assembly-robot-01',
                          name: 'Assembly Robot 01',
                          status: 'running',
                          metrics: {
                            power_consumption: 200,
                            speed: 50, // New metric added
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      };
      await hierarchyCollection.insertOne(hierarchyDocument);
      console.log('Factory hierarchy initialized.');
    } else {
      console.log('Factory hierarchy already exists.');
    }

    // insert initial sensor data
    const initialSensors = [
      {
        work_center_id: 'compressor-machine-01',
        sensor_type: 'Temperature',
        value: 70,
        timestamp: new Date(),
      },
      {
        work_center_id: 'compressor-machine-01',
        sensor_type: 'Pressure',
        value: 120,
        timestamp: new Date(),
      },
    ];
    await sensorCollection.insertMany(initialSensors);
    console.log('Initial sensor data inserted.');

    setupChangeStreams();
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initializeDatabase();

app.get('/factory_hierarchy', async (req, res) => {
  try {
    const hierarchy = await hierarchyCollection.findOne({ _id: 'aircon-factory-01' });
    res.json(hierarchy);
  } catch (error) {
    res.status(500).send('Error fetching factory hierarchy');
  }
});

app.get('/sensor_data', async (req, res) => {
  try {
    const sensors = await sensorCollection
      .find({ work_center_id: 'compressor-machine-01' })
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();

    res.json(sensors);
  } catch (error) {
    res.status(500).send('Error fetching sensor data');
  }
});

app.post('/sensor_data', async (req, res) => {
  try {
    const sensorData = req.body;
    sensorData.timestamp = new Date();

    await sensorCollection.insertOne(sensorData);

    res.json({ success: true });
  } catch (error) {
    res.status(500).send('Error inserting sensor data');
  }
});

app.get('/kpis', async (req, res) => {
  try {
    const workCenters = await getWorkCenters();

    // Calculate OEE for each work center
    const oeeCalculations = await calculateOEE(workCenters);

    res.json(oeeCalculations);
  } catch (error) {
    res.status(500).send('Error calculating KPIs');
  }
});

app.post('/update_machine_status', async (req, res) => {
  try {
    const { work_center_id, status } = req.body;
    const result = await hierarchyCollection.updateOne(
      { 'enterprise.sites.areas.lines.work_centers.id': work_center_id },
      {
        $set: {
          'enterprise.sites.$[].areas.$[].lines.$[].work_centers.$[wc].status': status,
        },
      },
      {
        arrayFilters: [{ 'wc.id': work_center_id }],
      }
    );

    if (result.modifiedCount > 0) {
      // Notify clients about the status change
      const update = {
        type: 'machine_status_update',
        data: { work_center_id, status },
      };

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(update));
        }
      });

      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Work center not found.' });
    }
  } catch (error) {
    res.status(500).send('Error updating machine status');
  }
});

app.post('/add_work_center', async (req, res) => {
  try {
    const { line_id, work_center } = req.body;
    const result = await hierarchyCollection.updateOne(
      { 'enterprise.sites.areas.lines.id': line_id },
      {
        $push: {
          'enterprise.sites.$[].areas.$[].lines.$[line].work_centers': work_center,
        },
      },
      {
        arrayFilters: [{ 'line.id': line_id }],
      }
    );

    if (result.modifiedCount > 0) {
      // Notify clients about the new work center
      const update = {
        type: 'hierarchy_update',
      };

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(update));
        }
      });

      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Line not found.' });
    }
  } catch (error) {
    res.status(500).send('Error adding work center');
  }
});

app.post('/delete_work_center', async (req, res) => {
  try {
    const { work_center_id } = req.body;
    const result = await hierarchyCollection.updateOne(
      { 'enterprise.sites.areas.lines.work_centers.id': work_center_id },
      {
        $pull: {
          'enterprise.sites.$[].areas.$[].lines.$[].work_centers': { id: work_center_id },
        },
      }
    );

    if (result.modifiedCount > 0) {
      // Notify clients about the deletion
      const update = {
        type: 'hierarchy_update',
      };

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(update));
        }
      });

      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Work center not found.' });
    }
  } catch (error) {
    res.status(500).send('Error deleting work center');
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

// Helper Functions
async function getWorkCenters() {
  const hierarchy = await hierarchyCollection.findOne({ _id: 'aircon-factory-01' });
  const sites = hierarchy.enterprise.sites;
  let workCenters = [];

  sites.forEach((site) => {
    site.areas.forEach((area) => {
      area.lines.forEach((line) => {
        workCenters = workCenters.concat(line.work_centers);
      });
    });
  });

  return workCenters;
}

async function calculateOEE(workCenters) {
  const oeeResults = [];

  for (const wc of workCenters) {
    // Sample calculations for OEE components
    const availability = wc.status === 'running' ? 1 : 0;
    const performance = wc.metrics.speed ? wc.metrics.speed / 100 : 0.5;
    const quality = 0.95; // Assume 95% quality rate

    const oee = availability * performance * quality;

    oeeResults.push({
      work_center_id: wc.id,
      work_center_name: wc.name,
      oee: (oee * 100).toFixed(2),
    });
  }

  return oeeResults;
}

function setupChangeStreams() {
  const sensorChangeStream = sensorCollection.watch();
  const hierarchyChangeStream = hierarchyCollection.watch();

  sensorChangeStream.on('change', (change) => {
    if (change.operationType === 'insert') {
      const sensorData = change.fullDocument;

      // Check for threshold breaches
      if (
        (sensorData.sensor_type === 'Temperature' && sensorData.value > 80) ||
        (sensorData.sensor_type === 'Pressure' && sensorData.value > 130)
      ) {
        // Send alert to connected WebSocket clients
        const alert = {
          type: 'threshold_breach',
          data: sensorData,
        };

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(alert));
          }
        });
      }

      // Send sensor data update to clients
      const update = {
        type: 'sensor_update',
        data: sensorData,
      };

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(update));
        }
      });
    }
  });

  hierarchyChangeStream.on('change', (change) => {
    if (['insert', 'update', 'replace'].includes(change.operationType)) {
      // Notify clients to refresh hierarchy
      const update = {
        type: 'hierarchy_update',
      };

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(update));
        }
      });
    }
  });

  console.log('Change streams set up for real-time notifications.');
}

