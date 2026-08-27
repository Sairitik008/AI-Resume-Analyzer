import React from 'react';
import styles from './Button.module.scss';

type Variant = 'primary' | 'secondary' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    children,
    className,
    ...rest
}) => {
    const spinnerClass = variant === 'secondary'
        ? `${styles.spinner} ${styles.spinnerDark}`
        : styles.spinner;

    return (
        <button
            className={`${styles.btn} ${styles[variant]} ${styles[size]} ${className ?? ''}`}
            disabled={disabled || loading}
            {...rest}
        >
            {loading && <span className={spinnerClass} aria-hidden="true" />}
            {children}
        </button>
    );
};
