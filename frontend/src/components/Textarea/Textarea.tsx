import React from 'react';
import styles from './FormField.module.scss';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
    id: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, id, className, ...rest }) => (
    <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor={id}>{label}</label>
        <textarea
            id={id}
            className={`${styles.textarea} ${error ? styles.hasError : ''} ${className ?? ''}`}
            aria-describedby={error ? `${id}-error` : undefined}
            aria-invalid={!!error}
            {...rest}
        />
        {error && (
            <span id={`${id}-error`} className={styles.errorMsg} role="alert">
                {error}
            </span>
        )}
    </div>
);
