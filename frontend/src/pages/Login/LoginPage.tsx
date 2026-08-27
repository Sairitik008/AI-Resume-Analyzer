import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './LoginPage.module.scss';

interface FormErrors {
    email?: string;
    password?: string;
}

function validate(email: string, password: string): FormErrors {
    const errors: FormErrors = {};
    if (!email.trim()) {
        errors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'That doesn\'t look like a valid email address.';
    }
    if (!password) {
        errors.password = 'Password is required.';
    }
    return errors;
}

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
    const [serverError, setServerError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');

        const errors = validate(email, password);
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        setFieldErrors({});
        setIsSubmitting(true);

        try {
            await login(email, password);
            // Success → AuthContext navigates to /dashboard
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setServerError(msg || 'That email and password combination doesn\'t seem right. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.heading}>Welcome back</h1>
            <p className={styles.subheading}>Sign in to continue to your dashboard.</p>

            {serverError && (
                <div className={styles.errorBanner} role="alert">
                    <AlertCircle size={16} />
                    <span>{serverError}</span>
                </div>
            )}

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.fieldGroup}>
                    <label className={styles.label} htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        className={`${styles.input} ${fieldErrors.email ? styles.hasError : ''}`}
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                    />
                    {fieldErrors.email && <span className={styles.fieldError}>{fieldErrors.email}</span>}
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label} htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        className={`${styles.input} ${fieldErrors.password ? styles.hasError : ''}`}
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                    {fieldErrors.password && <span className={styles.fieldError}>{fieldErrors.password}</span>}
                </div>

                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                    {isSubmitting ? 'Signing in…' : 'Sign In'}
                </button>
            </form>

            <p className={styles.footer}>
                Don't have an account? <Link to="/register">Create one</Link>
            </p>
        </div>
    );
}
