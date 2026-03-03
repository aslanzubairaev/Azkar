/*
  Это карточка одного азкара.
  Она показывает: порядковый номер в кружке, название, арабский текст,
  транслитерацию (чеченское произношение), перевод на чеченский,
  и счётчик повторений.
  Буквы с ударением в транслитерации выделяются красным цветом.
*/
import { AzkarItem } from '@/types/azkar';
import AzkarCounter from '@/components/AzkarCounter/AzkarCounter';
import styles from './AzkarCard.module.css';

interface AzkarCardProps {
  azkar: AzkarItem;
  index: number;
}

/* Разбивает текст транслитерации на части и оборачивает ударные буквы в красный цвет */
function renderWithAccents(text: string) {
  const parts = text.split(/([\u0400-\u04FF]\u0301|[áéíóúýÁÉÍÓÚÝ])/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <span key={i} className={styles.accent}>{part}</span> : part
  );
}

export default function AzkarCard({ azkar, index }: AzkarCardProps) {
  return (
    <article className={styles.card}>
      {/* Шапка карточки — номер в кружке, название, значок повторений */}
      <header className={styles.header}>
        <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
        <span className={styles.title}>{azkar.title}</span>
        <span className={styles.countBadge}>×{azkar.count}</span>
      </header>

      {/* Арабский текст молитвы */}
      <div className={`${styles.arabic} arabic`}>
        {azkar.arabic}
      </div>

      {/* Пунктирный разделитель */}
      <div className={styles.divider} />

      {/* Транслитерация — чеченское произношение с ударениями */}
      <div className={styles.transliteration}>
        {renderWithAccents(azkar.transliteration)}
      </div>

      {/* Пунктирный разделитель */}
      <div className={styles.divider} />

      {/* Перевод на чеченский */}
      <div className={styles.translation}>
        {azkar.translation}
      </div>

      {/* Подвал — счётчик повторений */}
      <footer className={styles.footer}>
        <AzkarCounter total={azkar.count} azkarId={azkar.id} />
      </footer>
    </article>
  );
}
