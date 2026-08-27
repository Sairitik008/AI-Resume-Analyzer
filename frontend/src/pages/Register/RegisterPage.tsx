import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './RegisterPage.module.scss';

interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

function validate(name: string, email: string, password: string, confirmPassword: string): FormErrors {
    const errors: FormErrors = {};
    if (!name.trim()) errors.name = 'Please enter your full name.';
    if (!email.trim()) {
        errors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'That doesn\'t look like a valid email.';
    }
    if (!password) {
        errors.password = 'Please choose a password.';
    } else if (password.length < 6) {
        errors.password = 'Password needs to be at least 6 characters.';
    }
    if (!confirmPassword) {
        errors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords don\'t match — double-check and try again.';
    }
    return errors;
}

export default function RegisterPage() {
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
    const [serverError, setServerError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');

        const errors = validate(name, email, password, confirmPassword);
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        setFieldErrors({});
        setIsSubmitting(true);

        try {
            await register(name, email, password);
            // AuthContext chains register → login → navigate('/dashboard')
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setServerError(msg || "We couldn't create your account right now. Check your connection or try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.heading}>Create your account</h1>
            <p className={styles.subheading}>Start analyzing your resume with AI in minutes.</p>

            {serverError && (
                <div className={styles.errorBanner} role="alert">
                    <AlertCircle size={16} />
                    <span>{serverError}</span>
                </div>
            )}

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.fieldGroup}>
                    <label className={styles.label} htmlFor="name">Full Name</label>
                    <input
                        id="name"
                        type="text"
                        className={`${styles.input} ${fieldErrors.name ? styles.hasError : ''}`}
                        placeholder="Jane Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                    />
                    {fieldErrors.name && <span className={styles.fieldError}>{fieldErrors.name}</span>}
                </div>

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
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                    {fieldErrors.password && <span className={styles.fieldError}>{fieldErrors.password}</span>}
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        className={`${styles.input} ${fieldErrors.confirmPassword ? styles.hasError : ''}`}
                        placeholder="Repeat your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                    {fieldErrors.confirmPassword && (
                        <span className={styles.fieldError}>{fieldErrors.confirmPassword}</span>
                    )}
                </div>

                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                    {isSubmitting ? 'Creating account…' : 'Create Account'}
                </button>
            </form>

            <p className={styles.footer}>
                Already have an account? <Link to="/login">Sign in</Link>
            </p>
        </div>
    );
}
