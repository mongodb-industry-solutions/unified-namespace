
import React, { useState, useEffect } from 'react';
import styles from '../styles/kpis.module.css';


function KPIs() {
  const [kpis, setKpis] = useState([]);

  useEffect(() => {
    fetchKPIs();
    const interval = setInterval(fetchKPIs, 10000);
    return () => clearInterval(interval);
  }, []);

  function fetchKPIs() {
    fetch('/kpis')
      .then((response) => response.json())
      .then((data) => {
        setKpis(data);
      });
  }

  return (
    <div className={styles.kpisContainer}>
      <h2>Key Performance Indicators (KPIs)</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Work Center</th>
            <th>OEE (%)</th>
          </tr>
        </thead>
        <tbody>
          {kpis.map((kpi) => (
            <tr key={kpi.work_center_id}>
              <td>{kpi.work_center_name}</td>
              <td>{kpi.oee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default KPIs;
