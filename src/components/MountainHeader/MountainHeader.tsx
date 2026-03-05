/*
  Этот файл — декоративная шапка сайта с фотографией.
  Для утренних азкаров показывает фото рассвета и тексты «أذكار الصباح»,
  для вечерних — фото заката и тексты «أذكار المساء».
  Поверх фото — тёмный оверлей для читаемости, пилюля с названием,
  арабский и русский заголовки, подзаголовок и кнопка «Начать чтение».
  Кнопка прокручивает страницу вниз к списку азкаров.
*/
import Image from 'next/image';
import styles from './MountainHeader.module.css';

interface MountainHeaderProps {
  mode: 'morning' | 'evening';
  azkarCount: number;
  onStartReading: () => void;
}

/* Тексты для утренних и вечерних азкаров — меняются при переключении вкладки */
const content = {
  morning: {
    label: 'Утренние азкары',
    arabic: 'أذكار الصباح',
    russian: 'Утренние азкары',
    subtitle: 'Чтение и поминание на каждый день',
  },
  evening: {
    label: 'Вечерние азкары',
    arabic: 'أذكار المساء',
    russian: 'Вечерние азкары',
    subtitle: 'Чтение и поминание на каждый день',
  },
};

export default function MountainHeader({ mode, azkarCount, onStartReading }: MountainHeaderProps) {
  /* Выбираем тексты в зависимости от текущего режима (утро/вечер) */
  const c = content[mode];

  return (
    <header className={styles.header}>
      {/* Два слоя фотографий — один для утра, другой для вечера; видимость через opacity */}
      <Image
        src="/images/morning.png"
        alt="Рассвет"
        fill
        sizes="100vw"
        priority
        className={`${styles.photo} ${mode === 'morning' ? styles.photoActive : ''}`}
      />
      <Image
        src="/images/evening.png"
        alt="Закат"
        fill
        sizes="100vw"
        className={`${styles.photo} ${mode === 'evening' ? styles.photoActive : ''}`}
      />

      {/* Тёмный градиент поверх фото — делает текст читаемым */}
      <div className={styles.overlay} />

      {/* Блок с текстами и кнопкой — по центру поверх фото */}
      <div className={styles.content}>
        {/* Пилюля с названием и количеством азкаров */}
        <span className={styles.label}>
          {c.label}
          <span className={styles.badge}>{azkarCount}</span>
        </span>

        {/* Заголовок на арабском */}
        <h1 className={styles.titleArabic}>{c.arabic}</h1>

        {/* Заголовок на русском */}
        <h2 className={styles.titleRussian}>{c.russian}</h2>

        {/* Подзаголовок */}
        <p className={styles.subtitle}>{c.subtitle}</p>

        {/* Кнопка прокрутки к списку азкаров */}
        <button className={styles.cta} onClick={onStartReading}>
          Начать чтение
        </button>
      </div>
    </header>
  );
}
