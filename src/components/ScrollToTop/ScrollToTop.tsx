/*
  Это кнопка «Наверх» — круглая кнопка в правом нижнем углу экрана.
  Она появляется когда человек прокрутил страницу вниз (шапка ушла за экран).
  При нажатии страница плавно прокручивается наверх.
*/
'use client';
import { useState, useEffect } from 'react';
import styles from './ScrollToTop.module.css';

export default function ScrollToTop() {
  /* Запоминает, нужно ли показывать кнопку */
  const [visible, setVisible] = useState(false);

  /* Следит за прокруткой страницы и показывает/скрывает кнопку */
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Прокручивает страницу наверх при нажатии */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      className={styles.btn}
      onClick={scrollToTop}
      aria-label="Прокрутить наверх"
    >
      ↑
    </button>
  );
}
