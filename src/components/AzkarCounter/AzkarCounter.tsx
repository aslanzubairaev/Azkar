/*
  Это счётчик повторений азкара.
  Он показывает, сколько раз нужно повторить азкар, и отмечает каждое нажатие.
  Если повторить нужно 1 раз — показывает галочку.
  Если до 10 раз — показывает точки.
  Если 100 раз — показывает круговой прогресс-бар.
  Когда все повторения выполнены, можно сбросить счётчик и начать заново.
*/
'use client';
import { useState, useCallback } from 'react';
import styles from './AzkarCounter.module.css';

interface AzkarCounterProps {
  total: number;
  onComplete?: () => void;
}

export default function AzkarCounter({ total, onComplete }: AzkarCounterProps) {
  // Запоминает сколько раз пользователь уже нажал
  const [current, setCurrent] = useState(0);
  const done = current >= total;

  // Засчитывает одно нажатие и сообщает о завершении если выполнены все повторения
  const handleTap = useCallback(() => {
    if (done) return;
    const next = current + 1;
    setCurrent(next);
    if (next >= total) onComplete?.();
  }, [current, done, total, onComplete]);

  // Сбрасывает счётчик на ноль чтобы начать заново
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
            stroke="var(--color-border)"
            strokeWidth="4"
          />
          <circle
            cx="36" cy="36" r={radius}
            fill="none"
            stroke="var(--color-copper)"
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
            fill="var(--color-milk)"
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
