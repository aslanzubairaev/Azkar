/*
  Кнопка «Поддержать проект» внизу страницы.
  При нажатии открывается модальное окно с тремя способами поддержки:
  1. Stripe — оплата картой / Apple Pay / Google Pay (перенаправление на Stripe Checkout)
  2. Сбер / СБП — QR-код и номер телефона для перевода
  3. Поделиться — отправить ссылку на сайт друзьям
*/
'use client';
import { useState, useEffect } from 'react';
import styles from './DonateButton.module.css';

export default function DonateButton() {
  /* Запоминает, открыто ли модальное окно */
  const [modalOpen, setModalOpen] = useState(false);

  /* Какой экран показан: главный выбор или экран Сбера */
  const [view, setView] = useState<'main' | 'sber'>('main');

  /* Идёт ли создание сессии оплаты Stripe */
  const [loading, setLoading] = useState(false);

  /* Текст всплывающего уведомления (например «Скопировано») */
  const [toast, setToast] = useState('');

  /* При прокрутке страницы закрывает модальное окно */
  useEffect(() => {
    if (!modalOpen) return;
    const onScroll = () => setModalOpen(false);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [modalOpen]);

  /* При закрытии модалки сбрасывает экран на главный */
  function closeModal() {
    setModalOpen(false);
    setView('main');
  }

  /* Создаёт сессию Stripe и перенаправляет на страницу оплаты */
  async function handleStripe() {
    setLoading(true);
    try {
      const res = await fetch('/api/support/stripe-session', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(false);
    }
  }

  /* Копирует номер телефона для СБП в буфер обмена */
  function copyPhone() {
    const phone = process.env.NEXT_PUBLIC_SBER_PHONE || '';
    navigator.clipboard.writeText(phone);
    showToast('Номер скопирован');
  }

  /* Делится ссылкой на сайт через Web Share API или копирует ссылку */
  async function handleShare() {
    const url = window.location.origin;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Азкары', url });
      } catch {
        /* пользователь отменил — ничего не делаем */
      }
    } else {
      await navigator.clipboard.writeText(url);
      showToast('Ссылка скопирована');
    }
  }

  /* Показывает временное уведомление внизу экрана */
  function showToast(text: string) {
    setToast(text);
    setTimeout(() => setToast(''), 2000);
  }

  return (
    <>
      {/* Кнопка внизу страницы */}
      <div className={styles.wrapper}>
        <button className={styles.btn} onClick={() => setModalOpen(true)}>
          Поддержать проект
        </button>
      </div>

      {/* Модальное окно с выбором способа поддержки */}
      {modalOpen && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

            {/* Главный экран — выбор способа */}
            {view === 'main' && (
              <>
                <h3 className={styles.modalTitle}>ДжазакаЛлаху хайран!</h3>
                <p className={styles.modalText}>
                  Этот сайт создан ради пользы. Если хотите помочь развитию проекта
                  (домен, хостинг, улучшения) — поддержите любой суммой.
                  Сайт всегда остаётся бесплатным.
                </p>

                <div className={styles.actions}>
                  {/* Кнопка оплаты через Stripe */}
                  <button
                    className={`${styles.actionBtn} ${styles.stripeBtn}`}
                    onClick={handleStripe}
                    disabled={loading}
                  >
                    {loading ? 'Переход к оплате...' : 'Картой / Apple Pay / Google Pay'}
                  </button>
                  <p className={styles.hint}>
                    На странице Stripe вы сможете выбрать любую сумму
                  </p>

                  {/* Кнопка перевода через Сбер / СБП */}
                  <button
                    className={`${styles.actionBtn} ${styles.sberBtn}`}
                    onClick={() => setView('sber')}
                  >
                    Сбер / СБП
                  </button>

                  {/* Кнопка «Поделиться сайтом» */}
                  <button
                    className={`${styles.actionBtn} ${styles.shareBtn}`}
                    onClick={handleShare}
                  >
                    Поделиться сайтом
                  </button>
                </div>
              </>
            )}

            {/* Экран Сбера — QR-код и номер телефона */}
            {view === 'sber' && (
              <>
                <h3 className={styles.modalTitle}>Сбер / СБП</h3>

                {/* QR-код для оплаты */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.qrImage}
                  src="/qr/sbp-qr.png"
                  alt="QR-код для оплаты через СБП"
                />

                <p className={styles.sberInstruction}>
                  Откройте приложение банка, выберите «Оплата по QR» и наведите камеру
                </p>

                {/* Номер телефона для перевода через СБП */}
                <div className={styles.phoneRow}>
                  <span className={styles.phoneNumber}>
                    {process.env.NEXT_PUBLIC_SBER_PHONE || 'Номер не указан'}
                  </span>
                  <button className={styles.copyBtn} onClick={copyPhone}>
                    Скопировать
                  </button>
                </div>

                <button className={styles.backBtn} onClick={() => setView('main')}>
                  Назад
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Всплывающее уведомление */}
      {toast && <div className={styles.toast}>{toast}</div>}
    </>
  );
}
