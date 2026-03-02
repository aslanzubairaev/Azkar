/*
  Этот файл — декоративная шапка сайта.
  Он показывает SVG-силуэт горных пиков и заголовок «أَذْكَار» с подзаголовком.
  Горы появляются снизу вверх при загрузке страницы, затем появляется текст.
*/
import styles from './MountainHeader.module.css';

export default function MountainHeader() {
  return (
    <header className={styles.header}>
      {/* Декоративный SVG — силуэт горных пиков двух рядов */}
      <div className={styles.mountains}>
        <svg
          viewBox="0 0 800 120"
          preserveAspectRatio="none"
          className={styles.mountainSvg}
          aria-hidden="true"
        >
          {/* Задний ряд гор — чуть светлее фона */}
          <polygon points="0,120 80,55 160,90 240,40 320,80 400,20 480,70 560,35 640,75 720,45 800,65 800,120" fill="#2f3335" />
          {/* Передний ряд гор — цвет фона страницы */}
          <polygon points="0,120 60,80 130,100 200,60 280,95 360,50 440,85 520,55 600,90 680,60 760,85 800,70 800,120" fill="#252829" />
        </svg>
      </div>

      {/* Заголовок на арабском */}
      <h1 className={styles.title}>أَذْكَار</h1>

      {/* Подзаголовок */}
      <p className={styles.subtitle}>Утренние и вечерние азкары</p>
    </header>
  );
}
