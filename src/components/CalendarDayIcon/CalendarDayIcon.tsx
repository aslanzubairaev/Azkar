/*
  Кастомная иконка календаря с текущим числом месяца.
  Показывает квадратик-календарь с цветной шапкой сверху
  и крупной цифрой дня по центру. Не зависит от эмодзи ОС —
  выглядит одинаково на всех устройствах.
*/

import styles from './CalendarDayIcon.module.css';

interface CalendarDayIconProps {
  day: number | null;
}

export default function CalendarDayIcon({ day }: CalendarDayIconProps) {
  return (
    <span className={styles.icon} aria-hidden="true">
      {/* Верхняя полоска-шапка календаря */}
      <span className={styles.header} />
      {/* Крупная цифра дня по центру */}
      <span className={styles.day}>{day ?? ''}</span>
    </span>
  );
}
