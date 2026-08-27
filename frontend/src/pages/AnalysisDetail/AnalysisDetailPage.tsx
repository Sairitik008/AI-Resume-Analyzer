import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, AlertCircle, ExternalLink } from 'lucide-react';
import { ScoreGauge } from '../../components/ScoreGauge/ScoreGauge';
import { SkillTag } from '../../components/SkillTag/SkillTag';
import { Button } from '../../components/Button/Button';
import ChecklistItem from '../../components/ChecklistItem/ChecklistItem';
import { getAnalysisById } from '../../services/analysisService';
import type { AnalysisDetail } from '../../types/analysis.types';
import styles from './AnalysisDetailPage.module.scss';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getVerdict(score: number): { label: string; cls: 'strong' | 'decent' | 'needsWork' } {
    if (score >= 75) return { label: '🎯 Strong match — great fit for this role', cls: 'strong' };
    if (score >= 50) return { label: '📈 Decent match — some gaps worth addressing', cls: 'decent' };
    return { label: '🔧 Needs work before applying', cls: 'needsWork' };
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric',
    });
}

/** Split long text into paragraph arrays on double-newlines or single newlines */
function toParagraphs(text: string): string[] {
    return text
        .split(/\n{2,}|\n/)
        .map((p) => p.trim())
        .filter(Boolean);
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AnalysisDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [data, setData] = useState<AnalysisDetail | null>(null);
    const [uiState, setUiState] = useState<'loading' | 'error' | 'ready'>('loading');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (!id) return;
        let alive = true;
        setUiState('loading');
        getAnalysisById(Number(id))
            .then((res) => { if (alive) { setData(res.data); setUiState('ready'); } })
            .catch((err) => {
                if (!alive) return;
                const msg = (err as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message;
                setErrorMsg(msg || 'Analysis not found or not accessible.');
                setUiState('error');
            });
        return () => { alive = false; };
    }, [id]);

    // ── Loading ───────────────────────────────────────────────────────────────
    if (uiState === 'loading') {
        return (
            <div className={styles.loadingWrap}>
                <span className={styles.spinner} aria-label="Loading analysis…" />
                <span style={{ color: 'var(--text-secondary)' }}>Loading your analysis…</span>
            </div>
        );
    }

    // ── Error ─────────────────────────────────────────────────────────────────
    if (uiState === 'error' || !data) {
        return (
            <div className={styles.errorWrap} role="alert">
                <AlertCircle size={36} />
                <p className={styles.errorText}>{errorMsg}</p>
                <Button variant="secondary" size="sm" onClick={() => navigate('/analysis-history')}>
                    Back to History
                </Button>
            </div>
        );
    }

    const verdict = getVerdict(data.match_score);
    const missingCount = Math.max(0, data.total_skills - data.skills_matched);
    const feedbackParas = toParagraphs(data.feedback_text);
    const recommendParas = toParagraphs(data.recommendations_text);

    // ATS Logic
    const hasContactPass = data.has_email && data.has_phone;
    const hasContactWarn = (data.has_email || data.has_phone) && !hasContactPass;
    const contactStatus = hasContactPass ? 'pass' : (hasContactWarn ? 'warn' : 'fail');
    const contactNote = !hasContactPass ? `Missing: ${!data.has_email ? 'Email' : ''} ${!data.has_email && !data.has_phone ? '& ' : ''}${!data.has_phone ? 'Phone' : ''}` : '';

    const missingSections = data.missing_sections || [];
    const secStatus = missingSections.length === 0 ? 'pass' : (missingSections.length <= 2 ? 'warn' : 'fail');
    const secNote = missingSections.length > 0 ? `Missing: ${missingSections.join(', ')}` : '';

    const dateStatus = data.has_dates ? 'pass' : 'fail';
    const dateNote = !data.has_dates ? 'Dates are crucial for ATS to understand experience duration.' : '';

    const qRatio = data.quantification_ratio || 0;
    const qStatus = qRatio > 0.4 ? 'pass' : (qRatio >= 0.2 ? 'warn' : 'fail');
    const qNote = `${Math.round(qRatio * 100)}% of your bullet points include measurable results.`;

    const lenStatus = data.length_flag === 'ok' ? 'pass' : 'warn';
    let lenNote = '';
    if (data.word_count) {
        if (data.length_flag === 'too_short') lenNote = `${data.word_count} words — consider adding more detail.`;
        else if (data.length_flag === 'too_long') lenNote = `${data.word_count} words — consider trimming.`;
        else lenNote = `${data.word_count} words — good length.`;
    }

    return (
        <div className={styles.page}>

            {/* ── Nav ── */}
            <div className={styles.nav}>
                <Link to="/analysis-history" className={styles.backLink}>
                    <ArrowLeft size={16} /> Back to History
                </Link>
                <Button variant="secondary" size="sm" onClick={() => navigate('/new-analysis')}>
                    <RotateCcw size={14} style={{ marginRight: '0.3rem' }} />
                    Run Another Analysis
                </Button>
            </div>

            {/* ── Top Priorities ── */}
            <div className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>Your Top Priorities</h2>
                <p className={styles.sectionMeta} style={{ marginBottom: data.improvement_summary?.length ? '1.5rem' : '0' }}>
                    The most impactful changes to make first, based on everything we found.
                </p>

                {(!data.improvement_summary || data.improvement_summary.length === 0) ? (
                    <p className={styles.emptyStateText}>
                        Nice work — we didn't find any major structural or content issues to prioritize. Check the detailed sections below for more nuanced feedback.
                    </p>
                ) : (
                    <div className={styles.priorityList}>
                        {data.improvement_summary.map((item, i) => (
                            <div key={i} className={styles.priorityCard}>
                                <div className={styles.priorityHeaderRow}>
                                    <div className={`${styles.severityDot} ${styles['severity-' + item.severity]}`} />
                                    <h3 className={styles.priorityHeading}>
                                        <span className={styles.priorityRank}>{item.priority}.</span> {item.issue}
                                    </h3>
                                </div>
                                <p className={styles.priorityAction}>{item.action}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Hero ── */}
            <div className={styles.hero}>
                <ScoreGauge score={data.match_score} size={140} strokeWidth={12} />
                <div className={styles.heroMeta}>
                    <h1 className={styles.heroTitle}>{data.jd_title}</h1>
                    <p className={styles.heroSub}>
                        Resume: <strong>{data.resume_filename}</strong> · Analysed {formatDate(data.created_at)}
                    </p>
                    <span className={`${styles.verdict} ${styles[verdict.cls]}`}>
                        {verdict.label}
                    </span>
                </div>
            </div>

            {/* ── Skills ── */}
            <div className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>Skills Breakdown</h2>
                <p className={styles.sectionMeta}>
                    {data.skills_matched} of {data.total_skills} skills matched
                    {missingCount > 0 && ` · ${missingCount} to develop`}
                </p>
                <div className={styles.skillsGrid}>
                    <div className={styles.skillGroup}>
                        <p className={styles.skillGroupLabel}>✓ Matched Skills</p>
                        <div className={styles.tagCloud}>
                            {data.skills_detected.length > 0
                                ? data.skills_detected.map((s) => (
                                    <SkillTag key={s} label={s} variant="matched" />
                                ))
                                : <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>None detected</span>
                            }
                        </div>
                    </div>
                    <div className={styles.skillGroup}>
                        <p className={styles.skillGroupLabel}>△ Skills to Develop</p>
                        <div className={styles.tagCloud}>
                            {missingCount > 0
                                ? <SkillTag label={`${missingCount} more skill${missingCount > 1 ? 's' : ''} to develop`} variant="missing" />
                                : <SkillTag label="All key skills matched!" variant="matched" />
                            }
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.5 }}>
                            See the recommendations below for specific areas to focus on.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── ATS Health ── */}
            <div className={styles.sectionCard}>
                <div className={styles.atsHeaderGroup}>
                    <div className={styles.atsTitleBlock}>
                        <h2 className={styles.sectionTitle}>ATS Health Check</h2>
                        <p className={styles.sectionMeta} style={{ marginBottom: 0 }}>
                            How well your resume's structure holds up to typical Applicant Tracking System scans.
                        </p>
                    </div>
                    {(data.ats_score !== undefined) && (
                        <div className={styles.atsScoreBlock}>
                            <span className={styles.atsScoreLabel}>ATS Score</span>
                            <ScoreGauge score={data.ats_score} size={60} strokeWidth={6} />
                        </div>
                    )}
                </div>

                <div className={styles.atsGrid}>
                    <ChecklistItem
                        status={contactStatus}
                        label="Contact Information"
                        note={contactNote}
                    />
                    <ChecklistItem
                        status={secStatus}
                        label="Standard Resume Sections"
                        note={secNote}
                    />
                    <ChecklistItem
                        status={dateStatus}
                        label="Work/Education Dates"
                        note={dateNote}
                    />
                    <ChecklistItem
                        status={qStatus}
                        label="Quantified Achievements"
                        note={qNote}
                    />
                    <ChecklistItem
                        status={lenStatus}
                        label="Resume Length"
                        note={lenNote}
                    />
                </div>
                <p className={styles.atsDisclaimer}>
                    This check analyzes text structure and common ATS patterns. It cannot detect visual layout issues like columns, nested tables, or graphics — for best results, also review your resume visually.
                </p>
            </div>

            {/* ── Feedback ── */}
            <div className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>AI Feedback</h2>
                <div className={styles.textBody}>
                    {feedbackParas.map((para, i) => (
                        <p key={i}>{para}</p>
                    ))}
                </div>
            </div>

            {/* ── Recommendations ── */}
            <div className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>Recommendations</h2>
                <div className={styles.textBody}>
                    {recommendParas.map((para, i) => (
                        <p key={i}>{para}</p>
                    ))}
                </div>
            </div>

            {/* ── Suggested Next Steps ── */}
            <div className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>Suggested Next Steps</h2>
                <p className={styles.sectionMeta} style={{ marginBottom: data.suggested_resources?.length ? '1.5rem' : '0' }}>
                    A few focused resources for the specific skills this role is looking for — not everything, just what matters here.
                </p>

                {(!data.suggested_resources || data.suggested_resources.length === 0) ? (
                    <p className={styles.emptyStateText}>
                        {data.skills_matched >= data.total_skills - 2
                            ? "No specific certification suggestions for this role — your skill set already covers the key areas well."
                            : "We don't have curated resources for these specific gaps yet. Consider researching standard tools independently."}
                    </p>
                ) : (
                    <div className={styles.resourceList}>
                        {data.suggested_resources.map((resource, i) => (
                            <div key={i} className={styles.resourceRow}>
                                <div className={styles.resourceInfo}>
                                    <span className={styles.resourceSkillTag}>{resource.skill}</span>
                                    <div className={styles.resourceDetails}>
                                        <h3 className={styles.resourceName}>{resource.name}</h3>
                                        <span className={styles.resourceProvider}>by {resource.provider}</span>
                                    </div>
                                </div>
                                <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.resourceLinkButton}
                                >
                                    View <ExternalLink size={14} />
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}
