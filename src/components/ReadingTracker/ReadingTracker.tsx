/*
  Это календарь чтения азкаров.
  Он показывает текущий месяц с отмеченными днями, когда человек читал азкары.
  Внизу показывает статистику: текущий страк (подряд идущих дней),
  лучший страк и общее число прочитанных дней.
  Клик по дню отмечает или снимает отметку чтения.
  Стрелки влево/вправо переключают отображаемый месяц.
  Все данные сохраняются в памяти браузера.
*/
'use client';
import { useState, useEffect } from 'react';
import styles from './ReadingTracker.module.css';

export default function ReadingTracker() {
  /* Отмеченные даты чтения в формате "2026-03-01" */
  const [dates, setDates] = useState<string[]>([]);
  /* Какой месяц сейчас показывается (год и месяц) */
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());

  /* Читает даты из памяти браузера, проверяя что данные корректные */
  const loadDates = () => {
    const saved = localStorage.getItem('azkar-reading-dates');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          /* Оставляем только строки формата "ГГГГ-ММ-ДД" */
          const valid = parsed.filter(
            (d: unknown) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)
          );
          setDates(valid);
          return;
        }
      } catch {}
    }
    setDates([]);
  };

  /* При загрузке — читаем сохранённые даты */
  useEffect(() => {
    loadDates();
  }, []);

  /* Слушает изменения в памяти браузера из другой вкладки */
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'azkar-reading-dates') loadDates();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  /* Слушает обновление дат из autoMarkToday (когда 100% прогресс) */
  useEffect(() => {
    const onCustomUpdate = () => loadDates();
    window.addEventListener('azkar-dates-updated', onCustomUpdate);
    return () => window.removeEventListener('azkar-dates-updated', onCustomUpdate);
  }, []);

  /* Форматирует дату в строку "2026-03-01" */
  const formatDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  /* Сегодняшняя дата в формате строки */
  const todayStr = formatDate(new Date());

  /* Отмечает или снимает отметку дня — если дата есть, убирает; если нет, добавляет.
     Будущие даты отметить нельзя. */
  const toggleDate = (dateStr: string) => {
    if (dateStr > todayStr) return;
    const next = dates.includes(dateStr)
      ? dates.filter((d) => d !== dateStr)
      : [...dates, dateStr];
    setDates(next);
    localStorage.setItem('azkar-reading-dates', JSON.stringify(next));
  };

  /* Считает текущий страк — сколько дней подряд отмечено от сегодня назад */
  const getCurrentStreak = () => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      if (dates.includes(formatDate(d))) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  /* Считает лучший страк за всю историю */
  const getBestStreak = () => {
    if (dates.length === 0) return 0;
    const sorted = [...dates].sort();
    let best = 1;
    let current = 1;
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1]);
      const curr = new Date(sorted[i]);
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (Math.round(diff) === 1) {
        current++;
        if (current > best) best = current;
      } else if (Math.round(diff) > 1) {
        current = 1;
      }
    }
    return best;
  };

  /* Возвращает дни месяца для отрисовки календарной сетки */
  const getCalendarDays = () => {
    const first = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0).getDate();
    /* День недели первого числа (0=Вс) → переводим в Пн=0 */
    let startDay = first.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const days: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let d = 1; d <= lastDay; d++) days.push(d);
    return days;
  };

  /* Названия месяцев на русском */
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  /* Переход к предыдущему месяцу */
  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };

  /* Переход к следующему месяцу */
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const calendarDays = getCalendarDays();
  const currentStreak = getCurrentStreak();
  const bestStreak = getBestStreak();

  return (
    <div className={styles.panel}>
      <div className={styles.inner}>
        {/* Заголовок с навигацией по месяцам */}
        <div className={styles.monthNav}>
          <button className={styles.navBtn} onClick={prevMonth} aria-label="Предыдущий месяц">‹</button>
          <span className={styles.monthTitle}>{monthNames[viewMonth]} {viewYear}</span>
          <button className={styles.navBtn} onClick={nextMonth} aria-label="Следующий месяц">›</button>
        </div>

        {/* Дни недели */}
        <div className={styles.weekdays}>
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d) => (
            <span key={d} className={styles.weekday}>{d}</span>
          ))}
        </div>

        {/* Сетка дней — клик по дню отмечает или снимает отметку */}
        <div className={styles.grid}>
          {calendarDays.map((day, i) => {
            if (day === null) return <span key={`empty-${i}`} className={styles.emptyDay} />;
            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isMarked = dates.includes(dateStr);
            const isToday = dateStr === todayStr;
            const isFuture = dateStr > todayStr;
            return (
              <button
                key={day}
                className={`${styles.day} ${isMarked ? styles.dayMarked : ''} ${isToday ? styles.dayToday : ''} ${isFuture ? styles.dayFuture : ''}`}
                onClick={() => toggleDate(dateStr)}
                disabled={isFuture}
                type="button"
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Статистика — горизонтальная полоска */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statIcon}>🔥</span>
            <span className={styles.statValue}>{currentStreak} дн.</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statIcon}>⭐</span>
            <span className={styles.statValue}>{bestStreak} дн.</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statIcon}>📖</span>
            <span className={styles.statValue}>{dates.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
