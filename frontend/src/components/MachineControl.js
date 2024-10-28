
import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/machineControl.module.css';

function MachineControl() {
  const [workCenterId, setWorkCenterId] = useState('');
  const [status, setStatus] = useState('running');
  const [newWorkCenter, setNewWorkCenter] = useState({
    id: '',
    name: '',
    status: 'idle',
    metrics: {},
  });
  const [lineId, setLineId] = useState('');

  const updateStatus = () => {
    axios
      .post('/update_machine_status', { work_center_id: workCenterId, status })
      .then((response) => {
        if (response.data.success) {
          alert('Machine status updated successfully.');
        } else {
          alert('Failed to update machine status.');
        }
      })
      .catch(() => alert('Error updating machine status.'));
  };

  const addWorkCenter = () => {
    axios
      .post('/add_work_center', { line_id: lineId, work_center: newWorkCenter })
      .then((response) => {
        if (response.data.success) {
          alert('Work center added successfully.');
        } else {
          alert('Failed to add work center.');
        }
      })
      .catch(() => alert('Error adding work center.'));
  };

  const deleteWorkCenter = () => {
    axios
      .post('/delete_work_center', { work_center_id: workCenterId })
      .then((response) => {
        if (response.data.success) {
          alert('Work center deleted successfully.');
        } else {
          alert('Failed to delete work center.');
        }
      })
      .catch(() => alert('Error deleting work center.'));
  };

  return (
    <div className={styles.machineSection}>
      <h2>Machine Control</h2>

      <div className={styles.inputSection}>
        <h3>Update Machine Status</h3>
        <input
         className={styles.input}
          type="text"
          placeholder="Work Center ID"
          value={workCenterId}
          onChange={(e) => setWorkCenterId(e.target.value)}
        />
        <select className={styles.input} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="running">Running</option>
          <option value="idle">Idle</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <button className={styles.addButton} onClick={updateStatus}>Update Status</button>
      </div>

      <div className={styles.inputSection}>
        <h3>Add New Work Center</h3>
        <input
         className={styles.input}
          type="text"
          placeholder="Line ID"
          value={lineId}
          onChange={(e) => setLineId(e.target.value)}
        />
        <input
         className={styles.input}
          type="text"
          placeholder="Work Center ID"
          value={newWorkCenter.id}
          onChange={(e) => setNewWorkCenter({ ...newWorkCenter, id: e.target.value })}
        />
        <input
         className={styles.input}
          type="text"
          placeholder="Work Center Name"
          value={newWorkCenter.name}
          onChange={(e) => setNewWorkCenter({ ...newWorkCenter, name: e.target.value })}
        />
        <select
         className={styles.input}
          value={newWorkCenter.status}
          onChange={(e) => setNewWorkCenter({ ...newWorkCenter, status: e.target.value })}
        >
          <option value="running">Running</option>
          <option value="idle">Idle</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <button className={styles.addButton} onClick={addWorkCenter}>Add Work Center</button>
      </div>

      <div className={styles.inputSection}>
        <h3>Delete Work Center</h3>
        <input
         className={styles.input}
          type="text"
          placeholder="Work Center ID"
          value={workCenterId}
          onChange={(e) => setWorkCenterId(e.target.value)}
        />
        <button className={styles.deleteButton} onClick={deleteWorkCenter}>Delete Work Center</button>
      </div>
    </div>
  );
}

export default MachineControl;
