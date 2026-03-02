/*
  Это карточка одного азкара.
  Она показывает: порядковый номер, название, арабский текст,
  транслитерацию (чеченское произношение), перевод на русский,
  и кнопки — аудиоплеер и счётчик повторений.
  Буквы с ударением в транслитерации выделяются красным цветом.
*/
import { AzkarItem } from '@/types/azkar';
import AzkarCounter from '@/components/AzkarCounter/AzkarCounter';
import AzkarAudio from '@/components/AzkarAudio/AzkarAudio';
import styles from './AzkarCard.module.css';

interface AzkarCardProps {
  azkar: AzkarItem;
  index: number;
}

// Разбивает текст транслитерации на части и оборачивает ударные буквы в <span> красного цвета.
function renderWithAccents(text: string) {
  const parts = text.split(/([\u0400-\u04FF]\u0301|[áéíóúýÁÉÍÓÚÝ])/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <span key={i} className={styles.accent}>{part}</span> : part
  );
}

export default function AzkarCard({ azkar, index }: AzkarCardProps) {
  return (
    <article className={styles.card} data-number={String(index + 1).padStart(2, '0')}>
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
        {renderWithAccents(azkar.transliteration)}
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
