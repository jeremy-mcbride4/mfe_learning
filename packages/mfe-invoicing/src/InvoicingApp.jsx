import React from 'react';
import styles from './InvoicingApp.module.css';

const INVOICES = [
  { id: 'INV-006', client: 'Summit Developers', job: 'Pre-construction site mapping', amount: 1800, due: 'May 4, 2026', status: 'sent' },
  { id: 'INV-005', client: 'Ridgeline Farms', job: 'Agricultural survey — 80 acres', amount: 1200, due: 'May 1, 2026', status: 'sent' },
  { id: 'INV-004', client: 'Apex Solar', job: 'Panel inspection — 3 sites', amount: 875, due: 'Apr 28, 2026', status: 'draft' },
  { id: 'INV-003', client: 'Harmon Construction', job: 'Roof inspection & mapping', amount: 450, due: 'Apr 14, 2026', status: 'paid' },
  { id: 'INV-002', client: 'Crestwood HOA', job: 'Neighborhood aerial photography', amount: 600, due: 'Apr 10, 2026', status: 'paid' },
  { id: 'INV-001', client: 'Bluewater Marina', job: 'Dock & vessel survey', amount: 525, due: 'Mar 28, 2026', status: 'overdue' },
];

const BADGE_CLASS = {
  draft: styles.badgeDraft,
  sent: styles.badgeSent,
  paid: styles.badgePaid,
  overdue: styles.badgeOverdue,
};

export default function InvoicingApp() {
  const totalPaid = INVOICES.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const totalOutstanding = INVOICES.filter(i => i.status === 'sent').reduce((s, i) => s + i.amount, 0);
  const totalOverdue = INVOICES.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>Invoicing</div>
          <div className={styles.subtitle}>{INVOICES.length} invoices</div>
        </div>
        <button className={styles.newButton}>+ New Invoice</button>
      </div>

      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Paid</div>
          <div className={`${styles.summaryAmount} ${styles.summaryAmountGreen}`}>${totalPaid.toLocaleString()}</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Outstanding</div>
          <div className={`${styles.summaryAmount} ${styles.summaryAmountAmber}`}>${totalOutstanding.toLocaleString()}</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Overdue</div>
          <div className={`${styles.summaryAmount} ${styles.summaryAmountRed}`}>${totalOverdue.toLocaleString()}</div>
        </div>
      </div>

      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th>Invoice</th>
            <th>Client</th>
            <th>Job</th>
            <th>Amount</th>
            <th>Due</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {INVOICES.map(inv => (
            <tr key={inv.id}>
              <td>{inv.id}</td>
              <td className={styles.clientCell}>{inv.client}</td>
              <td>{inv.job}</td>
              <td className={styles.amount}>${inv.amount.toLocaleString()}</td>
              <td>{inv.due}</td>
              <td>
                <span className={`${styles.badge} ${BADGE_CLASS[inv.status]}`}>{inv.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
