/*
  Это выпадающая панель настроек доступности.
  Она показывает выбор размера шрифта (обычный, увеличенный, крупный)
  и тумблер высокого контраста.
  Настройки сохраняются в памяти браузера.
*/
'use client';
import { useState, useEffect } from 'react';
import styles from './AccessibilityPanel.module.css';

type FontSize = 'normal' | 'large' | 'xlarge';

export default function AccessibilityPanel() {
  /* Запоминает текущий размер шрифта */
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  /* Запоминает, включён ли высокий контраст */
  const [highContrast, setHighContrast] = useState(false);

  /* При загрузке читает сохранённые настройки */
  useEffect(() => {
    const savedFont = localStorage.getItem('azkar-fontsize') as FontSize | null;
    const savedContrast = localStorage.getItem('azkar-contrast');
    if (savedFont) {
      setFontSize(savedFont);
      document.documentElement.setAttribute('data-fontsize', savedFont);
    }
    if (savedContrast === 'high') {
      setHighContrast(true);
      document.documentElement.setAttribute('data-contrast', 'high');
    }
  }, []);

  /* Меняет размер шрифта и сохраняет выбор */
  const changeFontSize = (size: FontSize) => {
    setFontSize(size);
    document.documentElement.setAttribute('data-fontsize', size);
    localStorage.setItem('azkar-fontsize', size);
  };

  /* Переключает высокий контраст */
  const toggleContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    if (next) {
      document.documentElement.setAttribute('data-contrast', 'high');
      localStorage.setItem('azkar-contrast', 'high');
    } else {
      document.documentElement.removeAttribute('data-contrast');
      localStorage.removeItem('azkar-contrast');
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.inner}>
        {/* Выбор размера шрифта */}
        <div className={styles.section}>
          <span className={styles.label}>Размер шрифта</span>
          <div className={styles.options}>
            <button
              className={`${styles.option} ${fontSize === 'normal' ? styles.active : ''}`}
              onClick={() => changeFontSize('normal')}
            >
              A
            </button>
            <button
              className={`${styles.option} ${styles.optionMedium} ${fontSize === 'large' ? styles.active : ''}`}
              onClick={() => changeFontSize('large')}
            >
              A
            </button>
            <button
              className={`${styles.option} ${styles.optionLarge} ${fontSize === 'xlarge' ? styles.active : ''}`}
              onClick={() => changeFontSize('xlarge')}
            >
              A
            </button>
          </div>
        </div>

        {/* Тумблер высокого контраста */}
        <div className={styles.section}>
          <span className={styles.label}>Высокий контраст</span>
          <button
            className={`${styles.toggle} ${highContrast ? styles.toggleOn : ''}`}
            onClick={toggleContrast}
            aria-label="Высокий контраст"
          >
            <span className={styles.toggleDot} />
          </button>
        </div>
      </div>
    </div>
  );
}
