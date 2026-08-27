import React from 'react';
import styles from './FormField.module.scss';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    id: string;
}

export const TextInput: React.FC<TextInputProps> = ({ label, error, id, className, ...rest }) => (
    <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor={id}>{label}</label>
        <input
            id={id}
            className={`${styles.input} ${error ? styles.hasError : ''} ${className ?? ''}`}
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
