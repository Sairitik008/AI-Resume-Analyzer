import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', backgroundColor: 'var(--bg-primary)' }}>
            <h1 style={{ fontSize: '5rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>404</h1>
            <h2 style={{ color: 'var(--text-primary)', margin: 0 }}>Page not found</h2>
            <p style={{ color: 'var(--text-secondary)' }}>The page you're looking for doesn't exist.</p>
            <Link to="/dashboard" style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-primary)', color: '#fff', borderRadius: '8px', fontWeight: 600 }}>
                Go to Dashboard
            </Link>
        </div>
    );
}
