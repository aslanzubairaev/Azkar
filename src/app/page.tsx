/*
  Это главная страница сайта с азкарами.
  Она показывает шапку с настройками (SiteHeader),
  декоративный заголовок с фото рассвета/заката (MountainHeader),
  затем список утренних или вечерних азкаров — на выбор пользователя.
  Человек нажимает на вкладку «Утренние» или «Вечерние», и список меняется.
  Карточки плавно появляются при прокрутке в видимую область.
  Панели настроек автоматически закрываются при скролле.
*/
'use client';
import { useState, useEffect, useRef } from 'react';
import { morningAzkar, eveningAzkar } from '@/data/azkar';
import AzkarCard from '@/components/AzkarCard/AzkarCard';
import MountainHeader from '@/components/MountainHeader/MountainHeader';
import SiteHeader from '@/components/SiteHeader/SiteHeader';
import AccessibilityPanel from '@/components/AccessibilityPanel/AccessibilityPanel';
import ReadingTracker from '@/components/ReadingTracker/ReadingTracker';
import ScrollToTop from '@/components/ScrollToTop/ScrollToTop';
import DonateButton from '@/components/DonateButton/DonateButton';
import styles from './page.module.css';

type Tab = 'morning' | 'evening';

export default function Home() {
  /* Запоминает, какая вкладка сейчас выбрана: утренние или вечерние азкары */
  const [activeTab, setActiveTab] = useState<Tab>('morning');
  /* Открыта ли панель настроек доступности */
  const [a11yOpen, setA11yOpen] = useState(false);
  /* Открыт ли календарь чтения */
  const [trackerOpen, setTrackerOpen] = useState(false);
  /* Ссылка на контейнер списка карточек для IntersectionObserver */
  const listRef = useRef<HTMLDivElement>(null);

  /* При прокрутке страницы автоматически закрывает открытые панели */
  useEffect(() => {
    const onScroll = () => {
      setA11yOpen(false);
      setTrackerOpen(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Наблюдатель за карточками — при появлении в видимой области добавляет класс видимости */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.cardVisible);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1 }
    );

    const cards = list.querySelectorAll(`.${styles.cardAnimate}`);
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [activeTab]);

  /* Список азкаров для выбранной вкладки */
  const list = activeTab === 'morning' ? morningAzkar : eveningAzkar;

  return (
    <>
      {/* Закреплённая шапка с настройками — остаётся видимой при прокрутке */}
      <div className={styles.stickyHeader}>
        <SiteHeader
          onAccessibilityClick={() => setA11yOpen(!a11yOpen)}
          onTrackerClick={() => setTrackerOpen(!trackerOpen)}
        />

        {/* Выпадающая панель настроек доступности */}
        {a11yOpen && <AccessibilityPanel />}

        {/* Выдвижной календарь чтения */}
        {trackerOpen && <ReadingTracker />}
      </div>

      {/* Декоративная шапка с фото рассвета/заката — на всю ширину экрана */}
      <MountainHeader mode={activeTab === 'morning' ? 'morning' : 'evening'} />

      <main className={styles.main}>
        {/* Переключатель между утренними и вечерними азкарами */}
        <nav className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'morning' ? styles.active : ''}`}
            onClick={() => setActiveTab('morning')}
          >
            🌅 Утренние
            <span className={styles.tabCount}>{morningAzkar.length}</span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'evening' ? styles.active : ''}`}
            onClick={() => setActiveTab('evening')}
          >
            🌙 Вечерние
            <span className={styles.tabCount}>{eveningAzkar.length}</span>
          </button>
        </nav>

        {/* Список карточек азкаров для выбранной вкладки */}
        <section className={styles.list} ref={listRef}>
          {list.map((azkar, i) => (
            <div
              key={azkar.id}
              className={styles.cardAnimate}
            >
              <AzkarCard azkar={azkar} index={i} />
            </div>
          ))}
        </section>

        {/* Кнопка поддержки автора внизу страницы */}
        <DonateButton />
      </main>

      {/* Кнопка прокрутки наверх — появляется при прокрутке вниз */}
      <ScrollToTop />
    </>
  );
}
