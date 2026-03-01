'use client';
import { useState, useCallback } from 'react';
import styles from './AzkarCounter.module.css';

interface AzkarCounterProps {
  total: number;
  onComplete?: () => void;
}

export default function AzkarCounter({ total, onComplete }: AzkarCounterProps) {
  const [current, setCurrent] = useState(0);
  const done = current >= total;

  const handleTap = useCallback(() => {
    if (done) return;
    const next = current + 1;
    setCurrent(next);
    if (next >= total) onComplete?.();
  }, [current, done, total, onComplete]);

  const handleReset = useCallback(() => {
    setCurrent(0);
  }, []);

  if (total === 1) {
    return (
      <div className={styles.wrapper}>
        <button
          className={`${styles.checkBtn} ${done ? styles.done : ''}`}
          onClick={done ? handleReset : handleTap}
          aria-label={done ? 'Прочитано. Нажмите чтобы сбросить' : 'Отметить как прочитанное'}
        >
          {done ? '✓' : '○'}
        </button>
      </div>
    );
  }

  if (total <= 10) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.dots} onClick={done ? handleReset : handleTap}>
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`${styles.dot} ${i < current ? styles.dotFilled : ''}`}
            />
          ))}
        </div>
        <span className={styles.label}>
          {done ? (
            <button className={styles.resetBtn} onClick={handleReset}>↺ Сбросить</button>
          ) : (
            `${current} / ${total}`
          )}
        </span>
      </div>
    );
  }

  // Ring for 100
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = (current / total) * circumference;

  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.ringBtn} ${done ? styles.done : ''}`}
        onClick={done ? handleReset : handleTap}
        aria-label={`${current} из ${total}`}
      >
        <svg width="72" height="72" viewBox="0 0 72 72">
          <circle
            cx="36" cy="36" r={radius}
            fill="none"
            stroke="var(--dot-empty)"
            strokeWidth="4"
          />
          <circle
            cx="36" cy="36" r={radius}
            fill="none"
            stroke="var(--accent-ring)"
            strokeWidth="4"
            strokeDasharray={`${progress} ${circumference}`}
            strokeLinecap="round"
            transform="rotate(-90 36 36)"
            style={{ transition: 'stroke-dasharray 0.2s ease' }}
          />
          <text
            x="36" y="36"
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--text-primary)"
            fontSize="14"
            fontFamily="inherit"
          >
            {done ? '✓' : current}
          </text>
        </svg>
      </button>
      {!done && (
        <span className={styles.label}>{current} / {total}</span>
      )}
      {done && (
        <button className={styles.resetBtn} onClick={handleReset}>↺ Сбросить</button>
      )}
    </div>
  );
}
