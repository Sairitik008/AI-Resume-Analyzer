import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ClipboardList } from 'lucide-react';
import { Button } from '../../components/Button/Button';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { getAnalyses } from '../../services/analysisService';
import type { AnalysisListItem } from '../../types/analysis.types';
import styles from './AnalysisHistoryPage.module.scss';

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
    });
}

function getScoreColor(score: number): string {
    if (score >= 75) return 'var(--color-success)';
    if (score >= 50) return 'var(--color-warning)';
    return 'var(--color-error)';
}

type UIState = 'loading' | 'error' | 'ready';

export default function AnalysisHistoryPage() {
    const [items, setItems] = useState<AnalysisListItem[]>([]);
    const [uiState, setUiState] = useState<UIState>('loading');
    const [errMsg, setErrMsg] = useState('');

    const load = useCallback(async () => {
        setUiState('loading');
        try {
            const res = await getAnalyses();
            setItems(res.data);
            setUiState('ready');
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })
                ?.response?.data?.message;
            setErrMsg(msg || 'Failed to load your analysis history.');
            setUiState('error');
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    return (
        <div className={styles.page}>

            {/* Header */}
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.heading}>Analysis History</h1>
                    <p className={styles.subheading}>All your past resume–job matches, most recent first.</p>
                </div>
                <Link to="/new-analysis">
                    <Button size="md">Run New Analysis</Button>
                </Link>
            </div>

            {/* Loading */}
            {uiState === 'loading' && (
                <div className={styles.loadingWrap}>
                    <span className={styles.spinner} aria-label="Loading…" />
                    <span>Loading history…</span>
                </div>
            )}

            {/* Error */}
            {uiState === 'error' && (
                <div className={styles.errorBanner} role="alert">
                    <AlertCircle size={32} />
                    <p className={styles.errorText}>{errMsg}</p>
                    <Button variant="secondary" size="sm" onClick={load}>Retry</Button>
                </div>
            )}

            {/* Empty */}
            {uiState === 'ready' && items.length === 0 && (
                <EmptyState
                    icon={<ClipboardList size={40} />}
                    heading="No analyses yet"
                    description="Run your first analysis to see how well your resume matches a job description."
                    actionLabel="Run New Analysis"
                    onAction={() => window.location.href = '/new-analysis'}
                />
            )}

            {/* List */}
            {uiState === 'ready' && items.length > 0 && (
                <div className={styles.list}>
                    {items.map((item) => (
                        <Link key={item.id} to={`/analysis/${item.id}`} className={styles.historyLink}>
                            <div className={styles.historyCard}>
                                {/* Score badge */}
                                <div className={styles.scoreBadge}>
                                    <span
                                        className={styles.scoreNumber}
                                        style={{ color: getScoreColor(item.match_score) }}
                                    >
                                        {item.match_score}%
                                    </span>
                                    <span className={styles.scoreLabel}>Match</span>
                                </div>

                                {/* Meta */}
                                <div className={styles.historyMeta}>
                                    <h3 className={styles.historyTitle}>{item.jd_title}</h3>
                                    <span className={styles.historyResume}>
                                        Resume: {item.resume_filename}
                                    </span>
                                    <span className={styles.historyDate}>
                                        {formatDate(item.created_at)}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
