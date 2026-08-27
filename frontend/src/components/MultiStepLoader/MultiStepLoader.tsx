import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
import styles from './MultiStepLoader.module.scss';

interface MultiStepLoaderProps {
    steps: string[];
    /** ms between each step transition, default 2200 */
    interval?: number;
}

export const MultiStepLoader: React.FC<MultiStepLoaderProps> = ({
    steps,
    interval = 2200,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setCurrentIndex((prev) => {
                if (prev < steps.length - 1) return prev + 1;
                return prev; // hold on last step until parent removes component
            });
        }, interval);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [steps.length, interval]);

    return (
        <div className={styles.wrapper} role="status" aria-live="polite">
            <div className={styles.spinnerRing} aria-hidden="true" />
            <ul className={styles.stepList}>
                {steps.map((step, i) => {
                    const done = i < currentIndex;
                    const active = i === currentIndex;
                    return (
                        <li
                            key={step}
                            className={`${styles.step} ${done ? styles.done : ''} ${active ? styles.active : ''}`}
                        >
                            <span className={styles.icon}>
                                {done
                                    ? <CheckCircle2 size={16} />
                                    : <span className={`${styles.dot} ${active ? styles.dotActive : ''}`} />}
                            </span>
                            <span className={styles.label}>{step}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
