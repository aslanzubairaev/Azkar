/*
  Это шапка сайта — верхняя панель с названием и кнопками настроек.
  Она показывает название «☪ Азкары» слева (клик — прокрутка наверх),
  а справа — кнопки: переключатель темы (солнце/луна),
  кнопка размера шрифта (Аа), кнопка календаря чтения.
  Все настройки сохраняются и восстанавливаются при перезагрузке.
*/
'use client';
import { useState, useEffect } from 'react';
import Logo from '@/components/Logo/Logo';
import styles from './SiteHeader.module.css';

type Theme = 'dark' | 'light';

interface SiteHeaderProps {
  onAccessibilityClick: () => void;
  onTrackerClick: () => void;
}

export default function SiteHeader({ onAccessibilityClick, onTrackerClick }: SiteHeaderProps) {
  /* Запоминает текущую тему — тёмную или светлую */
  const [theme, setTheme] = useState<Theme>('dark');

  /* При загрузке страницы читает сохранённую тему из памяти браузера */
  useEffect(() => {
    const saved = localStorage.getItem('azkar-theme') as Theme | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  /* Переключает тему между тёмной и светлой и сохраняет выбор */
  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('azkar-theme', next);
  };

  /* При нажатии на логотип — плавная прокрутка наверх */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={styles.header}>
      {/* Название сайта с логотипом — клик прокручивает наверх */}
      <button className={styles.brand} onClick={scrollToTop} aria-label="Прокрутить наверх">
        <Logo size={28} /> Азкары
      </button>

      {/* Группа кнопок настроек */}
      <div className={styles.actions}>
        {/* Переключатель темы — солнце для светлой, луна для тёмной */}
        <button
          className={styles.btn}
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
          title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Кнопка настроек доступности — размер шрифта и контраст */}
        <button
          className={styles.btn}
          onClick={onAccessibilityClick}
          aria-label="Настройки доступности"
          title="Размер шрифта"
        >
          Аа
        </button>

        {/* Кнопка календаря чтения */}
        <button
          className={styles.btn}
          onClick={onTrackerClick}
          aria-label="Календарь чтения"
          title="Календарь чтения"
        >
          📅
        </button>
      </div>
    </header>
  );
}
