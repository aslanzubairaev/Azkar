/*
  Этот компонент управляет установкой сайта как приложения на телефон.
  На Android он ловит системное предложение установки и показывает кнопку в шапке.
  На iOS (Safari) он показывает кнопку, при нажатии на которую открывается
  инструкция из 3 шагов: «Поделиться» → «На экран Домой» → «Добавить».
  Если сайт уже установлен как приложение — ничего не показывает.
*/
'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './InstallPrompt.module.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPromptProps {
  onStateChange: (visible: boolean, onClick: () => void) => void;
}

export default function InstallPrompt({ onStateChange }: InstallPromptProps) {
  /* Определяет платформу: 'android' (есть системное предложение), 'ios' (Safari на iPhone/iPad) или null */
  const [platform, setPlatform] = useState<'android' | 'ios' | null>(null);
  /* Открыта ли модалка с инструкцией для iOS */
  const [iosModalOpen, setIosModalOpen] = useState(false);
  /* Ссылка на сохранённое системное событие установки (Android) */
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  /* Определяет платформу и слушает события установки */
  useEffect(() => {
    /* Если сайт уже открыт как установленное приложение — ничего не делаем */
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    /* Слушает событие Android Chrome — предложение установки */
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      setPlatform('android');
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);

    /* Определяет iOS Safari: iPhone/iPad + не standalone */
    const ua = navigator.userAgent;
    const isIos = /iPhone|iPad|iPod/.test(ua);
    const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS/.test(ua);
    if (isIos && isSafari) {
      setPlatform('ios');
    }

    /* Когда приложение установлено — скрывает кнопку */
    const onInstalled = () => {
      setPlatform(null);
      deferredPromptRef.current = null;
    };
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  /* Вызывает установку на Android или открывает инструкцию на iOS */
  const handleInstallClick = () => {
    if (platform === 'android' && deferredPromptRef.current) {
      deferredPromptRef.current.prompt();
      deferredPromptRef.current.userChoice.then((choice) => {
        if (choice.outcome === 'accepted') {
          setPlatform(null);
        }
        deferredPromptRef.current = null;
      });
    } else if (platform === 'ios') {
      setIosModalOpen(true);
    }
  };

  /* Сообщает родителю, видна ли кнопка и что делать при клике */
  useEffect(() => {
    onStateChange(platform !== null, handleInstallClick);
  }, [platform]);

  /* При прокрутке страницы закрывает модалку iOS */
  useEffect(() => {
    if (!iosModalOpen) return;
    const onScroll = () => setIosModalOpen(false);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [iosModalOpen]);

  /* Модалка с инструкцией для iOS — на Android ничего не рендерится */
  if (!iosModalOpen) return null;

  return (
    <div className={styles.overlay} onClick={() => setIosModalOpen(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>Установить «Азкары»</h3>

        {/* Шаг 1 */}
        <div className={styles.step}>
          <span className={styles.stepNumber}>1</span>
          <span>Нажмите кнопку <strong>«Поделиться»</strong> (квадрат со стрелкой вверх) внизу экрана</span>
        </div>

        {/* Шаг 2 */}
        <div className={styles.step}>
          <span className={styles.stepNumber}>2</span>
          <span>Прокрутите вниз и выберите <strong>«На экран Домой»</strong></span>
        </div>

        {/* Шаг 3 */}
        <div className={styles.step}>
          <span className={styles.stepNumber}>3</span>
          <span>Нажмите <strong>«Добавить»</strong> в правом верхнем углу</span>
        </div>

        <button className={styles.modalClose} onClick={() => setIosModalOpen(false)}>
          Понятно
        </button>
      </div>
    </div>
  );
}
