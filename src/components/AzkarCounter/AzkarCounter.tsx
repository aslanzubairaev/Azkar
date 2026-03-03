/*
  Это счётчик повторений азкара — единый кольцевой дизайн для всех значений.
  Он показывает круг 80×80px с прогрессом внутри.
  Внутри круга — текст "3/7" или "73%" (для больших значений).
  При каждом нажатии круг сжимается (тактильная обратная связь).
  Когда все повторения выполнены — зелёный фон с пульс-анимацией.
  Кнопка «Сбросить» появляется после завершения.
*/
'use client';
import { useState, useCallback } from 'react';
import styles from './AzkarCounter.module.css';

interface AzkarCounterProps {
  total: number;
  azkarId: number;
  onComplete?: () => void;
}

export default function AzkarCounter({ total, azkarId, onComplete }: AzkarCounterProps) {
  /* Запоминает сколько раз пользователь уже нажал */
  const [current, setCurrent] = useState(0);
  /* Запоминает, идёт ли анимация сжатия при нажатии */
  const [tapping, setTapping] = useState(false);
  const done = current >= total;

  /* Засчитывает одно нажатие с тактильной анимацией */
  const handleTap = useCallback(() => {
    if (done) return;
    const next = current + 1;
    setCurrent(next);
    setTapping(true);
    setTimeout(() => setTapping(false), 100);
    if (next >= total) onComplete?.();
  }, [current, done, total, onComplete]);

  /* Сбрасывает счётчик на ноль */
  const handleReset = useCallback(() => {
    setCurrent(0);
  }, []);

  /* Параметры SVG-кольца прогресса */
  const size = 80;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (current / total) * circumference;

  /* Текст внутри кольца — дробь для малых значений, проценты для больших */
  const displayText = total > 10
    ? `${Math.round((current / total) * 100)}%`
    : `${current}/${total}`;

  return (
    <div className={styles.wrapper}>
      {/* Кольцевая кнопка */}
      <button
        className={`${styles.ringBtn} ${done ? styles.done : ''} ${tapping ? styles.tapping : ''}`}
        onClick={done ? handleReset : handleTap}
        aria-label={done ? 'Завершено. Нажмите чтобы сбросить' : `${current} из ${total}`}
        style={{ touchAction: 'manipulation' }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Фоновое кольцо */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={strokeWidth}
          />
          {/* Кольцо прогресса */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill={done ? 'var(--color-done)' : 'none'}
            fillOpacity={done ? 0.15 : 0}
            stroke={done ? 'var(--color-done)' : 'var(--color-copper)'}
            strokeWidth={strokeWidth}
            strokeDasharray={`${progress} ${circumference}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dasharray 0.2s ease, fill-opacity 0.3s' }}
          />
          {/* Текст внутри кольца */}
          <text
            x={size / 2} y={size / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fill={done ? 'var(--color-done)' : 'var(--color-milk)'}
            fontSize={done ? '20' : '14'}
            fontFamily="inherit"
            fontWeight={done ? '700' : '400'}
          >
            {done ? '✓' : displayText}
          </text>
        </svg>
      </button>

      {/* Кнопка сброса после завершения */}
      {done && (
        <button className={styles.resetBtn} onClick={handleReset}>↺ Сбросить</button>
      )}
    </div>
  );
}
