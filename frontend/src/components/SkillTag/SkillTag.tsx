import React from 'react';
import styles from './SkillTag.module.scss';

interface SkillTagProps {
    label: string;
    variant: 'matched' | 'missing';
}

export const SkillTag: React.FC<SkillTagProps> = ({ label, variant }) => (
    <span className={`${styles.tag} ${styles[variant]}`}>
        {label}
    </span>
);
