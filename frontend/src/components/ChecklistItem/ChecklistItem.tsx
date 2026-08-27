import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import styles from './ChecklistItem.module.scss';

export interface ChecklistItemProps {
    status: 'pass' | 'warn' | 'fail';
    label: string;
    note?: string;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ status, label, note }) => {

    const getIcon = () => {
        switch (status) {
            case 'pass':
                return <CheckCircle2 className={styles.iconPass} size={20} />;
            case 'warn':
                return <AlertTriangle className={styles.iconWarn} size={20} />;
            case 'fail':
                return <XCircle className={styles.iconFail} size={20} />;
        }
    };

    return (
        <div className={`${styles.checklistItem} ${styles[status]}`}>
            <div className={styles.iconContainer}>
                {getIcon()}
            </div>
            <div className={styles.content}>
                <span className={styles.label}>{label}</span>
                {note && <span className={styles.note}>{note}</span>}
            </div>
        </div>
    );
};

export default ChecklistItem;
