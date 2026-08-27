import React from 'react';
import styles from './Card.module.scss';

interface CardProps {
    hoverable?: boolean;
    className?: string;
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ hoverable = false, className, children }) => (
    <div className={`${styles.card} ${hoverable ? styles.hoverable : ''} ${className ?? ''}`}>
        {children}
    </div>
);
