import React from 'react';
import styles from './SchedulingApp.module.css';

const JOBS = [
  { id: 1, client: 'Harmon Construction', job: 'Roof inspection & mapping', month: 'APR', day: 21, time: '9:00 AM', status: 'today', location: 'Cincinnati, OH' },
  { id: 2, client: 'Summit Developers', job: 'Pre-construction site mapping', month: 'APR', day: 23, time: '7:30 AM', status: 'upcoming', location: 'Mason, OH' },
  { id: 3, client: 'Ridgeline Farms', job: 'Agricultural survey — 80 acres', month: 'APR', day: 25, time: '6:00 AM', status: 'upcoming', location: 'Lebanon, OH' },
  { id: 4, client: 'Apex Solar', job: 'Panel inspection — 3 sites', month: 'APR', day: 28, time: '10:00 AM', status: 'upcoming', location: 'Dayton, OH' },
  { id: 5, client: 'Crestwood HOA', job: 'Neighborhood aerial photography', month: 'APR', day: 10, time: '8:00 AM', status: 'completed', location: 'West Chester, OH' },
];

const BADGE_CLASS = {
  upcoming: styles.badgeUpcoming,
  today: styles.badgeToday,
  completed: styles.badgeCompleted,
};

export default function SchedulingApp() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>Scheduling</div>
          <div className={styles.subtitle}>{JOBS.filter(j => j.status !== 'completed').length} upcoming jobs</div>
        </div>
        <button className={styles.newButton}>+ Schedule Job</button>
      </div>
      <div className={styles.list}>
        {JOBS.map(job => (
          <div key={job.id} className={styles.card}>
            <div className={styles.datebox}>
              <div className={styles.dateMonth}>{job.month}</div>
              <div className={styles.dateDay}>{job.day}</div>
            </div>
            <div className={styles.info}>
              <div className={styles.clientName}>{job.client}</div>
              <div className={styles.jobDetails}>{job.job} &mdash; {job.location}</div>
            </div>
            <div className={styles.meta}>
              <span className={`${styles.badge} ${BADGE_CLASS[job.status]}`}>{job.status}</span>
              <span className={styles.time}>{job.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
