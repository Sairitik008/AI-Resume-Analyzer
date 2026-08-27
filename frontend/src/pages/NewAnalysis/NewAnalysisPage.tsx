import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../../components/Button/Button';
import { SelectDropdown } from '../../components/SelectDropdown/SelectDropdown';
import { MultiStepLoader } from '../../components/MultiStepLoader/MultiStepLoader';
import { useToast } from '../../components/Toast/Toast';
import { getResumes } from '../../services/resumeService';
import { getJobDescriptions } from '../../services/jobDescriptionService';
import { createAnalysis } from '../../services/analysisService';
import type { Resume } from '../../types/resume.types';
import type { JobDescription } from '../../types/jobDescription.types';
import styles from './NewAnalysisPage.module.scss';

const ANALYSIS_STEPS = [
    'Reading your resume…',
    'Comparing with job requirements…',
    'Generating personalized feedback…',
    'Finalizing your match report…',
];

export default function NewAnalysisPage() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [resumes, setResumes] = useState<Resume[]>([]);
    const [jds, setJds] = useState<JobDescription[]>([]);
    const [loadingLists, setLoadingLists] = useState(true);

    const [selectedResumeId, setSelectedResumeId] = useState<string>('');
    const [selectedJdId, setSelectedJdId] = useState<string>('');
    const [analyzing, setAnalyzing] = useState(false);

    // Fetch both lists in parallel on mount
    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const [rRes, jRes] = await Promise.all([getResumes(), getJobDescriptions()]);
                if (!alive) return;
                setResumes(rRes.data);
                setJds(jRes.data);
            } catch {
                if (alive) showToast('Failed to load your resumes or job descriptions.', 'error');
            } finally {
                if (alive) setLoadingLists(false);
            }
        })();
        return () => { alive = false; };
    }, [showToast]);

    const canAnalyze = !!selectedResumeId && !!selectedJdId && !analyzing;

    const handleAnalyze = async () => {
        if (!canAnalyze) return;
        setAnalyzing(true);
        try {
            const res = await createAnalysis(Number(selectedResumeId), Number(selectedJdId));
            navigate(`/analysis/${res.data.id}`);
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })
                ?.response?.data?.message;
            showToast(msg || 'Analysis failed. Please try again.', 'error');
            setAnalyzing(false);
        }
    };

    // ── Overlay during analysis ───────────────────────────────────────────────
    if (analyzing) {
        return (
            <div className={styles.analyzingOverlay}>
                <p className={styles.analyzingTitle}>Analysing your profile…</p>
                <MultiStepLoader steps={ANALYSIS_STEPS} />
                <p className={styles.analyzingSubtitle}>
                    This usually takes 5–15 seconds. Please don't close this tab.
                </p>
            </div>
        );
    }

    // ── Selector page ─────────────────────────────────────────────────────────
    return (
        <div className={styles.page}>
            <h1 className={styles.heading}>New Analysis</h1>
            <p className={styles.subheading}>
                Choose a resume and a job description. Our AI will assess how well your skills match the role and give you tailored feedback.
            </p>

            <div className={styles.card}>
                {loadingLists ? (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem 0' }}>
                        Loading your data…
                    </p>
                ) : (
                    <>
                        {/* ── Resume selector ── */}
                        {resumes.length === 0 ? (
                            <div className={styles.guidance}>
                                <AlertTriangle size={18} className={styles.guidanceIcon} />
                                <span>
                                    You haven't uploaded a resume yet.{' '}
                                    <Link to="/upload-resume">
                                        <Button variant="secondary" size="sm" type="button">Upload Resume</Button>
                                    </Link>
                                </span>
                            </div>
                        ) : (
                            <SelectDropdown
                                id="select-resume"
                                label="Select Resume"
                                placeholder="Choose a resume…"
                                value={selectedResumeId}
                                onChange={(e) => setSelectedResumeId(e.target.value)}
                                options={resumes.map((r) => ({
                                    value: r.id,
                                    label: r.original_filename,
                                }))}
                            />
                        )}

                        <hr className={styles.divider} />

                        {/* ── JD selector ── */}
                        {jds.length === 0 ? (
                            <div className={styles.guidance}>
                                <AlertTriangle size={18} className={styles.guidanceIcon} />
                                <span>
                                    You haven't added a job description yet.{' '}
                                    <Link to="/job-description">
                                        <Button variant="secondary" size="sm" type="button">Add Job Description</Button>
                                    </Link>
                                </span>
                            </div>
                        ) : (
                            <SelectDropdown
                                id="select-jd"
                                label="Select Job Description"
                                placeholder="Choose a job description…"
                                value={selectedJdId}
                                onChange={(e) => setSelectedJdId(e.target.value)}
                                options={jds.map((j) => ({
                                    value: j.id,
                                    label: j.title,
                                }))}
                            />
                        )}

                        <hr className={styles.divider} />

                        <div className={styles.analyzeRow}>
                            <Button
                                onClick={handleAnalyze}
                                disabled={!canAnalyze}
                                size="md"
                            >
                                Analyze Match
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
