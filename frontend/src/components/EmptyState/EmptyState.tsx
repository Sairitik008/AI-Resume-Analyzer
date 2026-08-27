import React from 'react';
import { Button } from '../Button/Button';
import styles from './EmptyState.module.scss';

interface EmptyStateProps {
    icon: React.ReactNode;
    heading: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon, heading, description, actionLabel, onAction,
}) => (
    <div className={styles.wrapper}>
        <div className={styles.iconWrap}>{icon}</div>
        <h3 className={styles.heading}>{heading}</h3>
        <p className={styles.description}>{description}</p>
        {actionLabel && onAction && (
            <Button variant="secondary" size="sm" onClick={onAction}>{actionLabel}</Button>
        )}
    </div>
);
