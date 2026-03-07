/*
  Страница отмены оплаты через Stripe.
  Показывает сообщение «Оплата отменена» и ссылку на главную страницу.
*/
import Link from 'next/link';
import styles from './page.module.css';

export default function CancelPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Оплата отменена</h1>
      <p className={styles.text}>
        Ничего страшного. Вы всегда можете поддержать проект позже или просто поделиться сайтом с друзьями.
      </p>
      <Link href="/" className={styles.link}>
        Вернуться на главную
      </Link>
    </div>
  );
}
