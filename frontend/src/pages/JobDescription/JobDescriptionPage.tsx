import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Eye, Pencil, Trash2, CalendarDays, AlertCircle, FileText } from 'lucide-react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { Modal } from '../../components/Modal/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog/ConfirmDialog';
import { TextInput } from '../../components/TextInput/TextInput';
import { Textarea } from '../../components/Textarea/Textarea';
import { useToast } from '../../components/Toast/Toast';
import {
    getJobDescriptions,
    getJobDescriptionById,
    createJobDescription,
    updateJobDescription,
    deleteJobDescription,
} from '../../services/jobDescriptionService';
import type { JobDescription, JobDescriptionDetail } from '../../types/jobDescription.types';
import styles from './JobDescriptionPage.module.scss';

// ─── Form Validation ──────────────────────────────────────────────────────────
interface FormErrors {
    title?: string;
    description_text?: string;
}

function validateForm(title: string, description_text: string): FormErrors {
    const errors: FormErrors = {};
    if (!title.trim()) {
        errors.title = 'Title is required.';
    } else if (title.trim().length < 2) {
        errors.title = 'Title must be at least 2 characters.';
    }
    if (!description_text.trim()) {
        errors.description_text = 'Description is required.';
    } else if (description_text.trim().length < 20) {
        errors.description_text = 'Description must be at least 20 characters.';
    }
    return errors;
}

// ─── Create / Edit Form ──────────────────────────────────────────────────────
interface JdFormProps {
    initialTitle?: string;
    initialText?: string;
    onSubmit: (title: string, text: string) => Promise<void>;
    onCancel: () => void;
    submitLabel: string;
}

function JdForm({ initialTitle = '', initialText = '', onSubmit, onCancel, submitLabel }: JdFormProps) {
    const [title, setTitle] = useState(initialTitle);
    const [text, setText] = useState(initialText);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validateForm(title, text);
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        setErrors({});
        setIsSubmitting(true);
        try {
            await onSubmit(title.trim(), text.trim());
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <TextInput
                id="jd-title"
                label="Job Title"
                placeholder="e.g. Senior Backend Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={errors.title}
                autoFocus
            />
            <Textarea
                id="jd-text"
                label="Job Description"
                placeholder="Paste the full job description here (minimum 20 characters)…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                error={errors.description_text}
                rows={8}
            />
            <div className={styles.formActions}>
                <Button type="button" variant="secondary" size="sm" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" size="sm" loading={isSubmitting}>
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}

// ─── Format Date ─────────────────────────────────────────────────────────────
function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
    });
}

// ─── Page Component ──────────────────────────────────────────────────────────
type UIState = 'loading' | 'error' | 'ready';

export default function JobDescriptionPage() {
    const { showToast } = useToast();

    // ── Master list state ─────────────────────────────────────────────────────
    const [jds, setJds] = useState<JobDescription[]>([]);
    const [uiState, setUiState] = useState<UIState>('loading');
    const [fetchError, setFetchError] = useState('');

    // ── Modal visibility flags ────────────────────────────────────────────────
    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<JobDescriptionDetail | null>(null);
    const [viewTarget, setViewTarget] = useState<JobDescriptionDetail | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<JobDescription | null>(null);
    const [loadingDetailId, setLoadingDetailId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // ── Fetch list ────────────────────────────────────────────────────────────
    const loadList = useCallback(async () => {
        setUiState('loading');
        setFetchError('');
        try {
            const res = await getJobDescriptions();
            setJds(res.data);
            setUiState('ready');
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })
                ?.response?.data?.message;
            setFetchError(msg || 'Failed to load job descriptions. Please try again.');
            setUiState('error');
        }
    }, []);

    useEffect(() => { loadList(); }, [loadList]);

    // ── Create ────────────────────────────────────────────────────────────────
    const handleCreate = async (title: string, description_text: string) => {
        const res = await createJobDescription(title, description_text);
        // Add the new JD (without description_text) to the top of the list
        const newItem: JobDescription = {
            id: res.data.id,
            title: res.data.title,
            created_at: res.data.created_at,
        };
        setJds((prev) => [newItem, ...prev]);
        setCreateOpen(false);
        showToast('Job description created successfully.', 'success');
    };

    // ── View ──────────────────────────────────────────────────────────────────
    const handleView = async (id: number) => {
        setLoadingDetailId(id);
        try {
            const res = await getJobDescriptionById(id);
            setViewTarget(res.data);
        } catch {
            showToast('Could not load the job description. Please try again.', 'error');
        } finally {
            setLoadingDetailId(null);
        }
    };

    // ── Edit (open pre-filled modal) ──────────────────────────────────────────
    const handleEditOpen = async (id: number) => {
        setLoadingDetailId(id);
        try {
            const res = await getJobDescriptionById(id);
            setEditTarget(res.data);
        } catch {
            showToast('Could not load the job description. Please try again.', 'error');
        } finally {
            setLoadingDetailId(null);
        }
    };

    const handleUpdate = async (title: string, description_text: string) => {
        if (!editTarget) return;
        const res = await updateJobDescription(editTarget.id, title, description_text);
        // Patch the list item in place
        setJds((prev) =>
            prev.map((jd) =>
                jd.id === editTarget.id ? { ...jd, title: res.data.title } : jd,
            ),
        );
        setEditTarget(null);
        showToast('Job description updated successfully.', 'success');
    };

    // ── Delete ────────────────────────────────────────────────────────────────
    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await deleteJobDescription(deleteTarget.id);
            setJds((prev) => prev.filter((jd) => jd.id !== deleteTarget.id));
            setDeleteTarget(null);
            showToast('Job description deleted.', 'success');
        } catch {
            showToast('Failed to delete. Please try again.', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className={styles.page}>

            {/* Page header */}
            <div className={styles.pageHeader}>
                <div className={styles.titleGroup}>
                    <h1 className={styles.heading}>Job Descriptions</h1>
                    <p className={styles.subheading}>
                        Save the job descriptions you're applying for. We'll use them to analyse how well your resume matches each role.
                    </p>
                </div>
                <Button
                    onClick={() => setCreateOpen(true)}
                    size="md"
                >
                    <Plus size={16} style={{ marginRight: '0.4rem' }} />
                    Add Job Description
                </Button>
            </div>

            {/* Loading */}
            {uiState === 'loading' && (
                <div className={styles.loadingWrap}>
                    <span className={styles.spinner} aria-label="Loading…" />
                    <span>Loading job descriptions…</span>
                </div>
            )}

            {/* Error */}
            {uiState === 'error' && (
                <div className={styles.errorBanner} role="alert">
                    <AlertCircle size={32} />
                    <p className={styles.errorText}>{fetchError}</p>
                    <Button variant="secondary" size="sm" onClick={loadList}>Retry</Button>
                </div>
            )}

            {/* Empty */}
            {uiState === 'ready' && jds.length === 0 && (
                <EmptyState
                    icon={<FileText size={40} />}
                    heading="No job descriptions yet"
                    description="Add your first job description and we'll use it to match your resume against the role."
                    actionLabel="Add Job Description"
                    onAction={() => setCreateOpen(true)}
                />
            )}

            {/* List */}
            {uiState === 'ready' && jds.length > 0 && (
                <div className={styles.grid}>
                    {jds.map((jd) => {
                        const isLoadingThis = loadingDetailId === jd.id;
                        return (
                            <Card key={jd.id} hoverable>
                                <div className={styles.jdCard}>
                                    <div className={styles.cardHeader}>
                                        <h3 className={styles.cardTitle}>{jd.title}</h3>
                                        <span className={styles.cardDate}>
                                            <CalendarDays size={13} />
                                            {formatDate(jd.created_at)}
                                        </span>
                                    </div>
                                    <div className={styles.cardActions}>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleView(jd.id)}
                                            loading={isLoadingThis && !editTarget}
                                            disabled={isLoadingThis}
                                            title="View full description"
                                        >
                                            <Eye size={14} style={{ marginRight: '0.3rem' }} />
                                            View
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleEditOpen(jd.id)}
                                            loading={isLoadingThis && !!editTarget}
                                            disabled={isLoadingThis}
                                            title="Edit this description"
                                        >
                                            <Pencil size={14} style={{ marginRight: '0.3rem' }} />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => setDeleteTarget(jd)}
                                            title="Delete this description"
                                        >
                                            <Trash2 size={14} style={{ marginRight: '0.3rem' }} />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* ── Create Modal ────────────────────────────────────────────── */}
            <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Add Job Description" size="lg">
                <JdForm
                    submitLabel="Save Job Description"
                    onSubmit={handleCreate}
                    onCancel={() => setCreateOpen(false)}
                />
            </Modal>

            {/* ── Edit Modal ──────────────────────────────────────────────── */}
            <Modal
                isOpen={!!editTarget}
                onClose={() => setEditTarget(null)}
                title="Edit Job Description"
                size="lg"
            >
                {editTarget && (
                    <JdForm
                        key={editTarget.id}
                        initialTitle={editTarget.title}
                        initialText={editTarget.description_text}
                        submitLabel="Save Changes"
                        onSubmit={handleUpdate}
                        onCancel={() => setEditTarget(null)}
                    />
                )}
            </Modal>

            {/* ── View Modal ──────────────────────────────────────────────── */}
            <Modal
                isOpen={!!viewTarget}
                onClose={() => setViewTarget(null)}
                title={viewTarget?.title ?? ''}
                size="lg"
            >
                {viewTarget && (
                    <div className={styles.viewContent}>
                        <span className={styles.viewMeta}>
                            Added {formatDate(viewTarget.created_at)}
                        </span>
                        <pre className={styles.viewText}>{viewTarget.description_text}</pre>
                    </div>
                )}
            </Modal>

            {/* ── Delete Confirm ──────────────────────────────────────────── */}
            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDeleteConfirm}
                title="Delete Job Description"
                message={`Are you sure you want to delete "${deleteTarget?.title}"? This can't be undone.`}
                isLoading={isDeleting}
            />
        </div>
    );
}
