
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function SensorChart({ data }) {
  const temperatureData = data
    .filter((sensor) => sensor.sensor_type === 'Temperature')
    .map((sensor) => ({
      timestamp: new Date(sensor.timestamp).toLocaleTimeString(),
      value: sensor.value,
    }));

  return (
    <div className="section">
      <h3>Temperature Over Time</h3>
      <LineChart
        width={600}
        height={300}
        data={temperatureData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="timestamp" />
        <YAxis domain={[60, 100]} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" name="Temperature" stroke="#00D2FF" />
      </LineChart>
    </div>
  );
}

export default SensorChart;
