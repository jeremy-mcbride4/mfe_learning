import React from 'react';
import styles from './FlightLogsApp.module.css';

const LOGS = [
  { id: 1, date: 'Apr 10, 2026', client: 'Crestwood HOA', location: 'West Chester, OH', duration: '1h 12m', altitude: '120m', battery: '2 packs', conditions: 'Clear' },
  { id: 2, date: 'Apr 8, 2026', client: 'Bluewater Marina', location: 'Loveland, OH', duration: '0h 48m', altitude: '90m', battery: '1 pack', conditions: 'Partly cloudy' },
  { id: 3, date: 'Apr 3, 2026', client: 'Greenfield Township', location: 'Xenia, OH', duration: '2h 05m', altitude: '120m', battery: '3 packs', conditions: 'Overcast' },
  { id: 4, date: 'Mar 28, 2026', client: 'Harmon Construction', location: 'Cincinnati, OH', duration: '0h 55m', altitude: '100m', battery: '1 pack', conditions: 'Clear' },
  { id: 5, date: 'Mar 21, 2026', client: 'Ridgeline Farms', location: 'Lebanon, OH', duration: '3h 30m', altitude: '80m', battery: '4 packs', conditions: 'Clear' },
];

export default function FlightLogsApp() {
  const totalHours = '8h 30m';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>Flight Logs</div>
          <div className={styles.subtitle}>{LOGS.length} flights logged &mdash; {totalHours} total flight time</div>
        </div>
        <button className={styles.newButton}>+ Log Flight</button>
      </div>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th>Date</th>
            <th>Client</th>
            <th>Location</th>
            <th>Duration</th>
            <th>Altitude</th>
            <th>Conditions</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {LOGS.map(log => (
            <tr key={log.id}>
              <td>{log.date}</td>
              <td className={styles.clientCell}>{log.client}</td>
              <td className={styles.locationCell}>{log.location}</td>
              <td className={styles.duration}>{log.duration}</td>
              <td>
                <span>{log.altitude}</span><br />
                <span className={styles.stat}>{log.battery}</span>
              </td>
              <td><span className={styles.conditionBadge}>{log.conditions}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
