import React from 'react';
import styles from './ProgressBar.module.scss';

interface ProgressBarProps {
    percent: number; // 0–100
    showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percent, showLabel = true }) => (
    <div>
        <div className={styles.track}>
            <div className={styles.fill} style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
        </div>
        {showLabel && <p className={styles.label}>{percent}%</p>}
    </div>
);
