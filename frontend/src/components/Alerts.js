
import React, { useState, useEffect } from 'react';
import styles from '../styles/alerts.module.css';

function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8089');

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'threshold_breach') {
        const alertMessage = `${message.data.sensor_type} sensor on ${message.data.work_center_id} exceeded threshold with value ${message.data.value}`;
        setAlerts((prevAlerts) => [...prevAlerts, { message: alertMessage, timestamp: Date.now() }]);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    
    alerts.length > 0 && (
      <div>
        
        <h2>Alerts</h2>
     
       <ul>
          {alerts.map((alert, index) => (
            <li key={index} className={styles.alertMsg}>
              {alert.message}
            </li>
          ))}
          </ul>
      </div>
    )
  );
}

export default Alerts;
