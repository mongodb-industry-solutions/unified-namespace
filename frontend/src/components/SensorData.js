
import React, { useState, useEffect } from 'react';
import SensorChart from './SensorChart';
import axios from 'axios';
import styles from '../styles/sensorData.module.css';

function SensorData() {
  const [sensorData, setSensorData] = useState([]);
  const [newSensorData, setNewSensorData] = useState({
    work_center_id: '',
    sensor_type: '',
    value: '',
  });

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000);
    return () => clearInterval(interval);
  }, []);

  function fetchSensorData() {
    fetch('/sensor_data')
      .then((response) => response.json())
      .then((data) => {
        setSensorData(data.reverse());
      });
  }

  const addSensorData = () => {
    axios
      .post('/sensor_data', newSensorData)
      .then((response) => {
        if (response.data.success) {
          alert('Sensor data added successfully.');
          fetchSensorData(); // Refresh data
        } else {
          alert('Failed to add sensor data.');
        }
      })
      .catch(() => alert('Error adding sensor data.'));
  };

  return (
    <div className={styles.sensorDataContainer}>
      <h2>Live Sensor Data</h2>
      
      <div className={styles.dataContainer}>
        <SensorChart data={sensorData} />
        <table border="1">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Sensor Type</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {sensorData.map((sensor) => (
              <tr key={sensor._id}>
                <td>{new Date(sensor.timestamp).toLocaleString()}</td>
                <td>{sensor.sensor_type}</td>
                <td>{sensor.value}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
      <div className={styles.addSensor}>
        <h3>Add Sensor Data</h3>
        <input
          className={styles.input}
          type="text"
          placeholder="Work Center ID"
          value={newSensorData.work_center_id}
          onChange={(e) => setNewSensorData({ ...newSensorData, work_center_id: e.target.value })}
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Sensor Type"
          value={newSensorData.sensor_type}
          onChange={(e) => setNewSensorData({ ...newSensorData, sensor_type: e.target.value })}
        />
        <input
          className={styles.input}
          type="number"
          placeholder="Value"
          value={newSensorData.value}
          onChange={(e) => setNewSensorData({ ...newSensorData, value: e.target.value })}
        />
        <button className={styles.addButton} onClick={addSensorData}>Add Sensor Data</button>
      </div>
    </div>
  );
}

export default SensorData;
