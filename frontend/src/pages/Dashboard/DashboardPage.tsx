import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileText, Zap, ClipboardList, FileStack, Briefcase, BarChart2, AlertCircle } from 'lucide-react';
import { ScoreGauge } from '../../components/ScoreGauge/ScoreGauge';
import { Button } from '../../components/Button/Button';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { getDashboardSummary } from '../../services/dashboardService';
import type { DashboardSummary } from '../../types/dashboard.types';
import styles from './DashboardPage.module.scss';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getGreeting(name: string): string {
    const hour = new Date().getHours();
    let period: string;
    if (hour < 12) period = 'Good morning';
    else if (hour < 17) period = 'Good afternoon';
    else period = 'Good evening';
    return `${period}, ${name || 'there'} 👋`;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
    });
}

function formatToday(): string {
    return new Date().toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
}

type UIState = 'loading' | 'error' | 'ready';

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
    const { user } = useAuth();
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [uiState, setUiState] = useState<UIState>('loading');
    const [errMsg, setErrMsg] = useState('');

    const load = useCallback(async () => {
        setUiState('loading');
        try {
            const res = await getDashboardSummary();
            setSummary(res.data);
            setUiState('ready');
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })
                ?.response?.data?.message;
            setErrMsg(msg || 'Failed to load dashboard data.');
            setUiState('error');
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    // ── Loading ───────────────────────────────────────────────────────────────
    if (uiState === 'loading') {
        return (
            <div className={styles.loadingWrap}>
                <span className={styles.spinner} aria-label="Loading dashboard…" />
                <span>Loading your dashboard…</span>
            </div>
        );
    }

    // ── Error ─────────────────────────────────────────────────────────────────
    if (uiState === 'error') {
        return (
            <div className={styles.errorBanner} role="alert">
                <AlertCircle size={32} />
                <p className={styles.errorText}>{errMsg}</p>
                <Button variant="secondary" size="sm" onClick={load}>Retry</Button>
            </div>
        );
    }

    const s = summary!;
    const recentAnalysis = s.most_recent_analysis;

    return (
        <div className={styles.page}>

            {/* ── Welcome ── */}
            <div className={styles.welcomeSection}>
                <h1 className={styles.greeting}>{getGreeting(user?.name ?? '')}</h1>
                <p className={styles.greetingDate}>{formatToday()}</p>
            </div>

            {/* ── Stats row ── */}
            <div>
                <p className={styles.sectionLabel}>Overview</p>
                <div className={styles.statsRow}>
                    <div className={styles.statCard}>
                        <FileStack size={20} className={styles.statIcon} />
                        <p className={styles.statValue}>{s.total_resumes}</p>
                        <p className={styles.statLabel}>Resumes</p>
                    </div>
                    <div className={styles.statCard}>
                        <Briefcase size={20} className={styles.statIcon} />
                        <p className={styles.statValue}>{s.total_job_descriptions}</p>
                        <p className={styles.statLabel}>Job Descriptions</p>
                    </div>
                    <div className={styles.statCard}>
                        <BarChart2 size={20} className={styles.statIcon} />
                        <p className={styles.statValue}>{s.total_analyses}</p>
                        <p className={styles.statLabel}>Analyses</p>
                    </div>
                    <div className={styles.statCard}>
                        <Zap size={20} className={styles.statIcon} />
                        <p className={`${styles.statValue} ${s.average_match_score !== null ? styles.statValueSmall : ''}`}>
                            {s.average_match_score !== null ? `${s.average_match_score}%` : '—'}
                        </p>
                        <p className={styles.statLabel}>Avg Match</p>
                    </div>
                </div>
            </div>

            {/* ── Quick actions ── */}
            <div>
                <p className={styles.sectionLabel}>Quick Actions</p>
                <div className={styles.actionsGrid}>
                    <Link to="/new-analysis" className={`${styles.actionCard} ${styles.primary}`}>
                        <Zap size={22} className={styles.actionIcon} />
                        <h3 className={styles.actionTitle}>Run New Analysis</h3>
                        <p className={styles.actionDesc}>Get your AI match score instantly.</p>
                    </Link>
                    <Link to="/upload-resume" className={styles.actionCard}>
                        <Upload size={22} className={styles.actionIcon} />
                        <h3 className={styles.actionTitle}>Upload Resume</h3>
                        <p className={styles.actionDesc}>Add or update your PDF CV.</p>
                    </Link>
                    <Link to="/job-description" className={styles.actionCard}>
                        <FileText size={22} className={styles.actionIcon} />
                        <h3 className={styles.actionTitle}>Add Job Description</h3>
                        <p className={styles.actionDesc}>Paste a role you're targeting.</p>
                    </Link>
                </div>
            </div>

            {/* ── Recent activity ── */}
            <div>
                <p className={styles.sectionLabel}>Recent Activity</p>
                {recentAnalysis ? (
                    <div className={styles.recentCard}>
                        <ScoreGauge score={recentAnalysis.match_score} size={80} strokeWidth={8} />
                        <div className={styles.recentMeta}>
                            <h3 className={styles.recentTitle}>{recentAnalysis.jd_title}</h3>
                            <p className={styles.recentSub}>Resume: {recentAnalysis.resume_filename}</p>
                            <p className={styles.recentSub}>Analysed {formatDate(recentAnalysis.created_at)}</p>
                        </div>
                        <div className={styles.recentLink}>
                            <Link to={`/analysis/${recentAnalysis.id}`}>
                                <Button variant="secondary" size="sm">View Full Result</Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <EmptyState
                        icon={<ClipboardList size={36} />}
                        heading="No analyses yet"
                        description="Upload a resume and add a job description first, then run your first AI analysis."
                        actionLabel="Run New Analysis"
                        onAction={() => window.location.href = '/new-analysis'}
                    />
                )}
            </div>

        </div>
    );
}
