import React, { Suspense, useSyncExternalStore } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import store from 'mfeStore/store';
import styles from './App.module.css';

const QuotesApp = React.lazy(() => import('mfeQuotes/QuotesApp'));
const SchedulingApp = React.lazy(() => import('mfeScheduling/SchedulingApp'));
const FlightLogsApp = React.lazy(() => import('mfeFlightLogs/FlightLogsApp'));
const InvoicingApp = React.lazy(() => import('mfeInvoicing/InvoicingApp'));
const PilotProfileApp = React.lazy(() => import('mfePilotProfile/PilotProfileApp'));

const navLinkStyle = ({ isActive }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`;

const Loading = () => (
    <div className={styles.loading}>
        <div className={styles.loadingDots}>
            <span /><span /><span />
        </div>
        <div className={styles.loadingText}>Loading</div>
    </div>
);

export default function App() {
    const selectedQuote = useSyncExternalStore(store.subscribe, store.getState).selectedQuote;

    return (
        <BrowserRouter>
            <div className={styles.app}>
                {selectedQuote && (
                    <div className={styles.toast}>Quote selected: {selectedQuote.client}</div>
                )}
                <aside className={styles.sidebar}>
                    <div className={styles.brand}>
                        <div className={styles.brandTitle}>Drone Job Manager</div>
                        <div className={styles.brandSub}>Operations Dashboard</div>
                    </div>
                    <nav className={styles.nav}>
                        <NavLink to="/" end className={navLinkStyle}>Home</NavLink>
                        <NavLink to="/quotes" className={navLinkStyle}>Quotes</NavLink>
                        <NavLink to="/scheduling" className={navLinkStyle}>Scheduling</NavLink>
                        <NavLink to="/flight-logs" className={navLinkStyle}>Flight Logs</NavLink>
                        <NavLink to="/invoicing" className={navLinkStyle}>Invoicing</NavLink>
                        <NavLink to="/pilot-profile" className={navLinkStyle}>Pilot Profile</NavLink>
                    </nav>
                </aside>
                <main className={styles.main}>
                    <Routes>
                        <Route path="/" element={
                            <div className={styles.home}>
                                <h1 className={styles.homeTitle}>Welcome back</h1>
                                <p className={styles.homeSub}>Select a section from the sidebar to get started.</p>
                            </div>
                        } />
                        <Route path="/quotes" element={<Suspense fallback={<Loading />}><QuotesApp /></Suspense>} />
                        <Route path="/scheduling" element={<Suspense fallback={<Loading />}><SchedulingApp /></Suspense>} />
                        <Route path="/flight-logs" element={<Suspense fallback={<Loading />}><FlightLogsApp /></Suspense>} />
                        <Route path="/invoicing" element={<Suspense fallback={<Loading />}><InvoicingApp /></Suspense>} />
                        <Route path="/pilot-profile" element={<Suspense fallback={<Loading />}><PilotProfileApp /></Suspense>} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}
