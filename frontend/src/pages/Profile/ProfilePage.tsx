import React, { useState, useEffect } from 'react';
import { LogOut, Moon, Sun } from 'lucide-react';
import { Button } from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getMe } from '../../services/authService';
import type { UserDetail } from '../../types/auth.types';
import styles from './ProfilePage.module.scss';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
}

function formatMemberSince(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric',
    });
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [profile, setProfile] = useState<UserDetail | null>(null);

    useEffect(() => {
        let alive = true;
        getMe()
            .then((res) => { if (alive) setProfile(res.data); })
            .catch(() => { /* fall back to auth context data */ });
        return () => { alive = false; };
    }, []);

    // Fall back to context user if /me hasn't resolved yet
    const displayName = profile?.name ?? user?.name ?? '';
    const displayEmail = profile?.email ?? user?.email ?? '';

    return (
        <div className={styles.page}>
            <h1 className={styles.heading}>Profile</h1>

            <div className={styles.profileCard}>

                {/* ── User info block ── */}
                <div className={styles.userBlock}>
                    <div className={styles.avatar} aria-label={`Avatar for ${displayName}`}>
                        {displayName ? getInitials(displayName) : '?'}
                    </div>
                    <div className={styles.userInfo}>
                        <h2 className={styles.userName}>{displayName || '—'}</h2>
                        <p className={styles.userEmail}>{displayEmail || '—'}</p>
                        {profile?.created_at && (
                            <p className={styles.memberSince}>
                                Member since {formatMemberSince(profile.created_at)}
                            </p>
                        )}
                    </div>
                </div>

                <hr className={styles.divider} />

                {/* ── Settings ── */}
                <div className={styles.settingsRow}>

                    {/* Theme toggle */}
                    <div className={styles.settingItem}>
                        <span className={styles.settingLabel}>
                            {theme === 'dark'
                                ? <Moon size={16} className={styles.settingIcon} />
                                : <Sun size={16} className={styles.settingIcon} />
                            }
                            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                        </span>
                        <label className={styles.toggleSwitch} aria-label="Toggle theme">
                            <input
                                type="checkbox"
                                className={styles.toggleInput}
                                checked={theme === 'dark'}
                                onChange={toggleTheme}
                            />
                            <span className={styles.toggleSlider} />
                        </label>
                    </div>

                </div>

                <hr className={styles.divider} />

                {/* ── Logout ── */}
                <Button
                    variant="danger"
                    size="md"
                    onClick={logout}
                >
                    <LogOut size={16} style={{ marginRight: '0.4rem' }} />
                    Sign Out
                </Button>

            </div>
        </div>
    );
}
