/*
  Это карточка одного азкара.
  Она показывает: порядковый номер в кружке, название, арабский текст,
  транслитерацию (чеченское произношение), перевод на чеченский,
  и счётчик повторений.
  Буквы с ударением в транслитерации выделяются красным цветом.
  Мужские формы слов [м:...] выделяются зелёным, женские [ж:...] — фиолетовым.
*/
import { AzkarItem } from '@/types/azkar';
import AzkarCounter from '@/components/AzkarCounter/AzkarCounter';
import styles from './AzkarCard.module.css';

interface AzkarCardProps {
  azkar: AzkarItem;
  index: number;
  tab: 'morning' | 'evening';
  onComplete?: (key: string, done: boolean) => void;
}

/* Выделяет мужские [м:] и женские [ж:] формы слов разными цветами */
function renderWithGender(text: string) {
  const parts = text.split(/(\[(?:м|ж):[^\]]+\])/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[(м|ж):([^\]]+)\]$/);
    if (match) {
      const cls = match[1] === 'м' ? styles.masculine : styles.feminine;
      return <span key={i} className={cls}>{match[2]}</span>;
    }
    return part;
  });
}

/* Разбивает текст транслитерации: сначала гендерные маркеры, потом ударные буквы */
function renderWithAccents(text: string) {
  const genderParts = text.split(/(\[(?:м|ж):[^\]]+\])/g);
  return genderParts.map((segment, fi) => {
    /* Если это мужская или женская форма — выделяем соответствующим цветом */
    const genderMatch = segment.match(/^\[(м|ж):([^\]]+)\]$/);
    if (genderMatch) {
      const cls = genderMatch[1] === 'м' ? styles.masculine : styles.feminine;
      return <span key={`g${fi}`} className={cls}>{genderMatch[2]}</span>;
    }
    /* Иначе ищем ударные буквы */
    const parts = segment.split(/([\u0400-\u04FF]\u0301|[áéíóúýÁÉÍÓÚÝ])/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <span key={`${fi}-${i}`} className={styles.accent}>{part}</span> : part
    );
  });
}

export default function AzkarCard({ azkar, index, tab, onComplete }: AzkarCardProps) {
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
        {renderWithGender(azkar.arabic)}
      </div>

      {/* Пунктирный разделитель */}
      <div className={styles.divider} />

      {/* Транслитерация — чеченское произношение с ударениями и женскими формами */}
      <div className={styles.transliteration}>
        {renderWithAccents(azkar.transliteration)}
      </div>

      {/* Пунктирный разделитель */}
      <div className={styles.divider} />

      {/* Перевод на чеченский */}
      <div className={styles.translation}>
        {renderWithGender(azkar.translation)}
      </div>

      {/* Подвал — счётчик повторений */}
      <footer className={styles.footer}>
        <AzkarCounter total={azkar.count} azkarId={azkar.id} tab={tab} onComplete={onComplete} />
      </footer>
    </article>
  );
}
