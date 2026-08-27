import React from 'react';
import styles from './SelectDropdown.module.scss';

export interface SelectOption {
    value: number | string;
    label: string;
}

interface SelectDropdownProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
    id: string;
    label: string;
    options: SelectOption[];
    placeholder?: string;
    error?: string;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
    id,
    label,
    options,
    placeholder = 'Select…',
    error,
    className,
    ...rest
}) => (
    <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor={id}>{label}</label>
        <div className={styles.selectWrap}>
            <select
                id={id}
                className={`${styles.select} ${error ? styles.hasError : ''} ${className ?? ''}`}
                aria-describedby={error ? `${id}-error` : undefined}
                aria-invalid={!!error}
                {...rest}
            >
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <span className={styles.arrow} aria-hidden="true">▾</span>
        </div>
        {error && (
            <span id={`${id}-error`} className={styles.errorMsg} role="alert">
                {error}
            </span>
        )}
    </div>
);
