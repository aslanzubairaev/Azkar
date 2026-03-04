/*
  Это кнопка «Поддержать автора» внизу страницы после списка азкаров.
  При нажатии открывается модальное окно с текстом благодарности.
  Это заглушка — пока без реальной функции оплаты.
*/
'use client';
import { useState, useEffect } from 'react';
import styles from './DonateButton.module.css';

export default function DonateButton() {
  /* Запоминает, открыто ли модальное окно */
  const [modalOpen, setModalOpen] = useState(false);

  /* При прокрутке страницы закрывает модальное окно */
  useEffect(() => {
    if (!modalOpen) return;
    const onScroll = () => setModalOpen(false);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [modalOpen]);

  return (
    <>
      {/* Кнопка внизу страницы */}
      <div className={styles.wrapper}>
        <button className={styles.btn} onClick={() => setModalOpen(true)}>
          ❤ Поддержать автора
        </button>
      </div>

      {/* Модальное окно благодарности */}
      {modalOpen && (
        <div className={styles.overlay} onClick={() => setModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Джазакумуллаху хайран!</h3>
            <p className={styles.modalText}>
              Спасибо за желание поддержать проект. Мы работаем над подключением
              способов поддержки. Пока лучшая помощь — поделиться этим сайтом
              с теми, кому он может быть полезен.
            </p>
            <button className={styles.modalClose} onClick={() => setModalOpen(false)}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
}
