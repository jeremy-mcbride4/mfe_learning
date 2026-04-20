import React from 'react';
import styles from './QuotesApp.module.css';

const QUOTES = [
  { id: 1, client: 'Harmon Construction', job: 'Roof inspection & mapping', amount: 450, status: 'approved', date: 'Apr 14, 2026' },
  { id: 2, client: 'Ridgeline Farms', job: 'Agricultural survey — 80 acres', amount: 1200, status: 'sent', date: 'Apr 17, 2026' },
  { id: 3, client: 'Apex Solar', job: 'Panel inspection — 3 sites', amount: 875, status: 'draft', date: 'Apr 19, 2026' },
  { id: 4, client: 'Crestwood HOA', job: 'Neighborhood aerial photography', amount: 600, status: 'approved', date: 'Apr 10, 2026' },
  { id: 5, client: 'Bluewater Marina', job: 'Dock & vessel survey', amount: 525, status: 'declined', date: 'Apr 8, 2026' },
  { id: 6, client: 'Summit Developers', job: 'Pre-construction site mapping', amount: 1800, status: 'sent', date: 'Apr 20, 2026' },
];

const BADGE_CLASS = {
  draft: styles.badgeDraft,
  sent: styles.badgeSent,
  approved: styles.badgeApproved,
  declined: styles.badgeDeclined,
};

export default function QuotesApp() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>Quotes</div>
          <div className={styles.subtitle}>{QUOTES.length} quotes total</div>
        </div>
        <button className={styles.newButton}>+ New Quote</button>
      </div>
      <div className={styles.grid}>
        {QUOTES.map(quote => (
          <div key={quote.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.clientName}>{quote.client}</div>
                <div className={styles.jobType}>{quote.job}</div>
              </div>
              <span className={`${styles.badge} ${BADGE_CLASS[quote.status]}`}>
                {quote.status}
              </span>
            </div>
            <hr className={styles.divider} />
            <div className={styles.cardFooter}>
              <span className={styles.amount}>${quote.amount.toLocaleString()}</span>
              <span className={styles.date}>{quote.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
