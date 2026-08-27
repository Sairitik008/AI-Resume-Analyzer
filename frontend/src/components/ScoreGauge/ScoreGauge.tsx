import React, { useEffect, useRef } from 'react';
import styles from './ScoreGauge.module.scss';

interface ScoreGaugeProps {
    score: number;       // 0–100
    size?: number;       // diameter in px, default 120
    strokeWidth?: number;
}

function getScoreColor(score: number): string {
    if (score >= 75) return 'var(--color-success)';
    if (score >= 50) return 'var(--color-warning)';
    return 'var(--color-error)';
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
    score,
    size = 120,
    strokeWidth = 10,
}) => {
    const circleRef = useRef<SVGCircleElement>(null);

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;
    const color = getScoreColor(score);
    const clampedScore = Math.max(0, Math.min(100, score));

    useEffect(() => {
        const circle = circleRef.current;
        if (!circle) return;

        // Start at 0 (full dash offset = nothing drawn)
        circle.style.strokeDashoffset = String(circumference);
        // Animate to target on next frame
        const raf = requestAnimationFrame(() => {
            const offset = circumference - (clampedScore / 100) * circumference;
            circle.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
            circle.style.strokeDashoffset = String(offset);
        });
        return () => cancelAnimationFrame(raf);
    }, [circumference, clampedScore]);

    return (
        <div className={styles.wrapper} style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                aria-label={`Match score: ${score}%`}
                role="img"
            >
                {/* Track */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="var(--color-border)"
                    strokeWidth={strokeWidth}
                />
                {/* Progress arc — starts at top (−90°) */}
                <circle
                    ref={circleRef}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                    transform={`rotate(-90 ${center} ${center})`}
                />
            </svg>
            {/* Score label centered in SVG */}
            <div className={styles.label} style={{ color }}>
                <span className={styles.score}>{clampedScore}</span>
                <span className={styles.unit}>%</span>
            </div>
        </div>
    );
};
