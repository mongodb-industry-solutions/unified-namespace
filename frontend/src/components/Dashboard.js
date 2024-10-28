
import React from 'react';
import Alerts from './Alerts';
import KPIs from './KPIs';
import SensorData from './SensorData';
import SensorChart from './SensorChart'
import Hierarchy from './Hierarchy';
import MachineControl from './MachineControl';
import styles from '../styles/dashboard.module.css';


function Dashboard() {
  return (
    <div className={styles.dashboardContainer}>
      <h1>Aircon Factory Dashboard</h1>
      <Alerts />
      <KPIs />
      <SensorData />

      <div className={styles.machineSection}>
        <MachineControl />
        <Hierarchy />

      </div>
    </div>
  );
}

export default Dashboard;
