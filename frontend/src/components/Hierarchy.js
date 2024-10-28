
import React, { useState, useEffect } from 'react';
import styles from '../styles/hierarchy.module.css';

function Hierarchy() {
  const [hierarchy, setHierarchy] = useState(null);

  useEffect(() => {
    fetchHierarchy();

    const socket = new WebSocket('ws://localhost:8089');

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'hierarchy_update') {
        fetchHierarchy();
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  function fetchHierarchy() {
    fetch('/factory_hierarchy')
      .then((response) => response.json())
      .then((data) => {
        setHierarchy(JSON.stringify(data, null, 2));
      });
  }

  return (
    <div className={styles.hierarchySection}>
      <h2>Factory Hierarchy</h2>
      <pre className={styles.hierarchyDocument}>{hierarchy}</pre>
    </div>
  );
}

export default Hierarchy;
