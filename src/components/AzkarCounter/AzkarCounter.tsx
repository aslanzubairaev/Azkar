/*
  Это счётчик повторений азкара — единый кольцевой дизайн для всех значений.
  Он показывает круг 80×80px с прогрессом внутри.
  Внутри круга — текст "3/7" или "73%" (для больших значений).
  При каждом нажатии круг сжимается (тактильная обратная связь).
  Когда все повторения выполнены — зелёный фон с пульс-анимацией.
  Кнопка «Сбросить» появляется после завершения.
  Прогресс сохраняется в памяти браузера и привязан к дате — на следующий день счётчики чистые.
*/
'use client';
import { useState, useCallback, useEffect } from 'react';
import styles from './AzkarCounter.module.css';

interface AzkarCounterProps {
  total: number;
  azkarId: number;
  tab: 'morning' | 'evening';
  onComplete?: (key: string, done: boolean) => void;
  /* Вызывается при финальном нажатии — для авто-перехода к следующему азкару */
  onFinished?: () => void;
}

/* Возвращает сегодняшнюю дату в формате "2026-03-04" */
function getTodayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `azkar-progress-${y}-${m}-${day}`;
}

/* Читает сохранённый прогресс всех счётчиков за сегодня */
function loadProgress(): Record<string, number> {
  try {
    const raw = localStorage.getItem(getTodayKey());
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/* Сохраняет прогресс конкретного счётчика в память браузера */
function saveProgress(key: string, count: number) {
  const progress = loadProgress();
  progress[key] = count;
  localStorage.setItem(getTodayKey(), JSON.stringify(progress));
}

export default function AzkarCounter({ total, azkarId, tab, onComplete, onFinished }: AzkarCounterProps) {
  /* Составной ключ: вкладка + id азкара — чтобы утренний и вечерний прогресс не смешивались */
  const progressKey = `${tab}-${azkarId}`;

  /* Запоминает сколько раз пользователь уже нажал (начальное значение из памяти браузера) */
  const [current, setCurrent] = useState(0);
  /* Запоминает, идёт ли анимация сжатия при нажатии */
  const [tapping, setTapping] = useState(false);
  const done = current >= total;

  /* При загрузке читает сохранённый прогресс из памяти браузера и сообщает странице статус */
  useEffect(() => {
    const saved = loadProgress()[progressKey];
    if (saved !== undefined && saved > 0) {
      setCurrent(saved);
      onComplete?.(progressKey, saved >= total);
    }
  }, [progressKey]);

  /* Засчитывает одно нажатие с тактильной анимацией */
  const handleTap = useCallback(() => {
    if (done) return;
    const next = current + 1;
    setCurrent(next);
    saveProgress(progressKey, next);
    setTapping(true);
    setTimeout(() => setTapping(false), 100);
    if (next >= total) {
      onComplete?.(progressKey, true);
      onFinished?.();
    }
  }, [current, done, total, progressKey, onComplete, onFinished]);

  /* Сбрасывает счётчик на ноль */
  const handleReset = useCallback(() => {
    setCurrent(0);
    saveProgress(progressKey, 0);
    onComplete?.(progressKey, false);
  }, [progressKey, onComplete]);

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
