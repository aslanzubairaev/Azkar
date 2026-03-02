/*
  Это карточка одного азкара.
  Она показывает: порядковый номер, название, арабский текст,
  транслитерацию (чеченское произношение), перевод на русский,
  и кнопки — аудиоплеер и счётчик повторений.
*/
import { AzkarItem } from '@/types/azkar';
import AzkarCounter from '@/components/AzkarCounter/AzkarCounter';
import AzkarAudio from '@/components/AzkarAudio/AzkarAudio';
import styles from './AzkarCard.module.css';

interface AzkarCardProps {
  azkar: AzkarItem;
  index: number;
}

export default function AzkarCard({ azkar, index }: AzkarCardProps) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
        <span className={styles.title}>{azkar.title}</span>
        <span className={styles.countBadge}>×{azkar.count}</span>
      </header>

      <div className={`${styles.arabic} arabic`}>
        {azkar.arabic}
      </div>

      <div className={styles.divider} />

      <div className={styles.transliteration}>
        {azkar.transliteration}
      </div>

      <div className={styles.divider} />

      <div className={styles.translation}>
        {azkar.translation}
      </div>

      <footer className={styles.footer}>
        {azkar.audioFile && (
          <AzkarAudio src={`/audio/${azkar.audioFile}`} />
        )}
        <AzkarCounter total={azkar.count} />
      </footer>
    </article>
  );
}
