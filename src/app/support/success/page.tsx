/*
  Страница благодарности после успешной оплаты через Stripe.
  Показывает сообщение «Спасибо!» и ссылку на главную страницу.
*/
import Link from 'next/link';
import styles from './page.module.css';

export default function SuccessPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ДжазакаЛлаху хайран!</h1>
      <p className={styles.text}>
        Спасибо за вашу поддержку. Пусть Аллах примет это от вас и воздаст вам благом.
      </p>
      <Link href="/" className={styles.link}>
        Вернуться на главную
      </Link>
    </div>
  );
}
