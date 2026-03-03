/*
  Этот файл — декоративная шапка сайта с фотографией.
  Для утренних азкаров показывает фото рассвета,
  для вечерних — фото заката.
  Поверх фото — заголовок «أَذْكَار» и подзаголовок.
  При переключении вкладок фото плавно сменяется.
*/
import styles from './MountainHeader.module.css';

interface MountainHeaderProps {
  mode: 'morning' | 'evening';
}

export default function MountainHeader({ mode }: MountainHeaderProps) {
  return (
    <header className={styles.header}>
      {/* Два слоя фотографий — один для утра, другой для вечера; видимость через opacity */}
      <img
        src="/images/morning.png"
        alt="Рассвет"
        className={`${styles.photo} ${mode === 'morning' ? styles.photoActive : ''}`}
      />
      <img
        src="/images/evening.png"
        alt="Закат"
        className={`${styles.photo} ${mode === 'evening' ? styles.photoActive : ''}`}
      />

      {/* Заголовок на арабском */}
      <h1 className={styles.title}>أَذْكَار</h1>

      {/* Подзаголовок */}
      <p className={styles.subtitle}>Утренние и вечерние азкары</p>
    </header>
  );
}
