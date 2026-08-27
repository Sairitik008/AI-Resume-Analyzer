import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar/Sidebar';
import { Header } from '../Header/Header';
import styles from './MainLayout.module.scss';

export const MainLayout: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className={styles.layout}>
            <Sidebar mobileOpen={mobileOpen} closeMobile={() => setMobileOpen(false)} />
            {mobileOpen && <div className={styles.overlay} onClick={() => setMobileOpen(false)} />}

            <div className={styles.contentWrapper}>
                <Header onMenuClick={() => setMobileOpen(true)} />
                <main className={styles.mainContent}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
