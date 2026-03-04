/*
  Это выпадающая панель настроек доступности.
  Она показывает 3 ползунка для независимой настройки размера шрифта:
  арабский текст, транскрипция и перевод.
  Также есть тумблер высокого контраста.
  Настройки сохраняются в памяти браузера и применяются через CSS-переменные.
*/
'use client';
import { useState, useEffect } from 'react';
import styles from './AccessibilityPanel.module.css';

/* Настройки каждого ползунка: ключ в localStorage, CSS-переменная, диапазон */
const sliders = [
  { key: 'azkar-font-arabic', cssVar: '--font-size-arabic', label: 'Арабский', min: 0.9, max: 2.0, step: 0.1, defaultVal: 1.2 },
  { key: 'azkar-font-translit', cssVar: '--font-size-translit', label: 'Транскрипция', min: 0.7, max: 1.6, step: 0.1, defaultVal: 1.0 },
  { key: 'azkar-font-translation', cssVar: '--font-size-translation', label: 'Перевод', min: 0.7, max: 1.4, step: 0.1, defaultVal: 0.875 },
] as const;

export default function AccessibilityPanel() {
  /* Запоминает текущие значения трёх ползунков */
  const [values, setValues] = useState<number[]>([1.2, 1.0, 0.875]);
  /* Запоминает, включён ли высокий контраст */
  const [highContrast, setHighContrast] = useState(false);

  /* При загрузке читает сохранённые настройки из памяти браузера */
  useEffect(() => {
    const restored = sliders.map((s) => {
      const saved = localStorage.getItem(s.key);
      if (saved) {
        const num = parseFloat(saved);
        if (!isNaN(num)) {
          document.documentElement.style.setProperty(s.cssVar, num + 'rem');
          return num;
        }
      }
      return s.defaultVal;
    });
    setValues(restored);

    const savedContrast = localStorage.getItem('azkar-contrast');
    if (savedContrast === 'high') {
      setHighContrast(true);
      document.documentElement.setAttribute('data-contrast', 'high');
    }
  }, []);

  /* Меняет размер шрифта конкретного блока и сохраняет */
  const changeSize = (index: number, value: number) => {
    const next = [...values];
    next[index] = value;
    setValues(next);
    const s = sliders[index];
    document.documentElement.style.setProperty(s.cssVar, value + 'rem');
    localStorage.setItem(s.key, String(value));
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
        {/* Три ползунка размера шрифта — арабский, транскрипция, перевод */}
        {sliders.map((s, i) => (
          <div key={s.key} className={styles.sliderSection}>
            <span className={styles.label}>{s.label}</span>
            <input
              type="range"
              className={styles.slider}
              min={s.min}
              max={s.max}
              step={s.step}
              value={values[i]}
              onChange={(e) => changeSize(i, parseFloat(e.target.value))}
            />
            <span className={styles.sliderValue}>{values[i].toFixed(1)}</span>
          </div>
        ))}

        {/* Тумблер высокого контраста */}
        <div className={styles.contrastSection}>
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
