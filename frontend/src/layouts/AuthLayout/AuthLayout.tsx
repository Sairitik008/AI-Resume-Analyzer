import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './AuthLayout.module.scss';

export const AuthLayout: React.FC = () => {
    return (
        <div className={styles.authLayout}>
            <div className={styles.authCard}>
                <div className={styles.brand}>AI Resume Analyzer</div>
                <p className={styles.tagline}>Map your career trajectory with AI precision</p>
                <Outlet />
            </div>
        </div>
    );
};
