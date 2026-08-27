import React from 'react';
import { Modal } from '../Modal/Modal';
import { Button } from '../Button/Button';
import styles from './ConfirmDialog.module.scss';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    isLoading = false,
}) => (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
            <Button variant="secondary" size="sm" onClick={onClose} disabled={isLoading}>
                Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={onConfirm} loading={isLoading}>
                Delete
            </Button>
        </div>
    </Modal>
);
