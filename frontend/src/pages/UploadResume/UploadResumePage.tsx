import React, { useState } from 'react';
import { uploadResume } from '../../services/resumeService';
import { Button } from '../../components/Button/Button';
import styles from './UploadResumePage.module.scss'; // Assuming this exists or using inline for now, but let's stick to inline css variables if styles file isn't imported, wait, let's just use inline variables correctly or create CSS. I'll use the existing inline structure but cleaned up.

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function UploadResumePage() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<string>('');
    const [uploading, setUploading] = useState<boolean>(false);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            setStatus('Error: File size exceeds the 5MB limit.');
            return;
        }

        setStatus('Uploading and Parsing...');
        setUploading(true);
        try {
            await uploadResume(file);
            setStatus('CV Successfully Embedded into AI Storage!');
            setFile(null);
        } catch (err: any) {
            setStatus(`Error: ${err.message || 'Upload failed'}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <h1 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Upload Resume</h1>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                Provide a `.pdf` or `.docx` representation of your CV to securely store it matching against Job Descriptions limits.
            </p>

            <div style={{ maxWidth: '500px', backgroundColor: 'var(--bg-surface)', padding: '2.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border)' }}>
                <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <input
                        type="file"
                        accept=".pdf,.docx"
                        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                        style={{ color: 'var(--text-primary)', padding: '1rem', border: '2px dashed var(--color-border)', borderRadius: '8px', cursor: 'pointer' }}
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={!file || uploading}
                        loading={uploading}
                    >
                        Commence Vector Storage
                    </Button>
                </form>
                {status && <p style={{ marginTop: '1.5rem', fontWeight: '500', color: status.includes('Error') ? 'var(--color-error)' : 'var(--color-success)' }}>{status}</p>}
            </div>
        </div>
    );
}
