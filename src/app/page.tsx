/*
  Это главная страница сайта с азкарами.
  Она показывает шапку с настройками (SiteHeader),
  декоративный заголовок с фото рассвета/заката (MountainHeader),
  затем список утренних или вечерних азкаров — на выбор пользователя.
  Человек нажимает на вкладку «Утренние» или «Вечерние», и список меняется.
  Под вкладками — полоска прогресса, показывающая процент выполненных азкаров.
  Когда все азкары на вкладке завершены (100%) — день автоматически отмечается в календаре.
  Карточки плавно появляются при прокрутке в видимую область.
  Клик вне шапки или прокрутка вниз закрывает открытые панели (настройки, календарь).
*/
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { morningAzkar, eveningAzkar } from '@/data/azkar';
import AzkarCard from '@/components/AzkarCard/AzkarCard';
import MountainHeader from '@/components/MountainHeader/MountainHeader';
import SiteHeader from '@/components/SiteHeader/SiteHeader';
import AccessibilityPanel from '@/components/AccessibilityPanel/AccessibilityPanel';
import ReadingTracker from '@/components/ReadingTracker/ReadingTracker';
import ScrollToTop from '@/components/ScrollToTop/ScrollToTop';
import DonateButton from '@/components/DonateButton/DonateButton';
import AzkarBenefit from '@/components/AzkarBenefit/AzkarBenefit';
import styles from './page.module.css';

type Tab = 'morning' | 'evening';

/* Добавляет сегодняшнюю дату в календарь чтения (если ещё не добавлена) */
function autoMarkToday() {
  const d = new Date();
  const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  let dates: string[] = [];
  try {
    const raw = localStorage.getItem('azkar-reading-dates');
    if (raw) dates = JSON.parse(raw);
  } catch {}
  if (!dates.includes(todayStr)) {
    dates.push(todayStr);
    localStorage.setItem('azkar-reading-dates', JSON.stringify(dates));
  }
}

export default function Home() {
  /* Запоминает, какая вкладка сейчас выбрана: утренние или вечерние азкары */
  const [activeTab, setActiveTab] = useState<Tab>('morning');
  /* Открыта ли панель настроек доступности */
  const [a11yOpen, setA11yOpen] = useState(false);
  /* Открыт ли календарь чтения */
  const [trackerOpen, setTrackerOpen] = useState(false);
  /* Какие азкары завершены — карта "вкладка-id" → true/false */
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
  /* Ссылка на контейнер списка карточек для IntersectionObserver */
  const listRef = useRef<HTMLDivElement>(null);
  /* Ссылка на закреплённую шапку — для определения клика вне неё */
  const headerRef = useRef<HTMLDivElement>(null);
  /* Ссылка на блок вкладок — для прокрутки к карточкам по кнопке «Начать чтение» */
  const tabsRef = useRef<HTMLElement>(null);

  /* Плавная прокрутка к вкладкам при нажатии кнопки «Начать чтение» */
  const scrollToCards = useCallback(() => {
    tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  /* Клик вне шапки закрывает открытые панели (настройки, календарь) */
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setA11yOpen(false);
        setTrackerOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  /* При прокрутке вниз более чем на 50px закрывает открытые панели */
  useEffect(() => {
    let startY = window.scrollY;
    const onScroll = () => {
      if (window.scrollY - startY > 50) {
        setA11yOpen(false);
        setTrackerOpen(false);
      }
      if (window.scrollY < startY) {
        startY = window.scrollY;
      }
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

  /* Когда счётчик азкара завершён или сброшен — обновляет карту завершений */
  const handleComplete = useCallback((key: string, done: boolean) => {
    setCompletedMap((prev) => ({ ...prev, [key]: done }));
  }, []);

  /* Список азкаров для выбранной вкладки */
  const list = activeTab === 'morning' ? morningAzkar : eveningAzkar;

  /* Считает сколько азкаров из текущей вкладки завершено */
  const completedCount = list.filter((a) => completedMap[`${activeTab}-${a.id}`]).length;
  /* Процент выполнения текущей вкладки */
  const progressPercent = list.length > 0 ? Math.round((completedCount / list.length) * 100) : 0;

  /* Когда процент достигает 100% — автоматически отмечает сегодняшний день в календаре */
  useEffect(() => {
    if (progressPercent === 100) {
      autoMarkToday();
    }
  }, [progressPercent]);

  return (
    <>
      {/* Закреплённая шапка с настройками — остаётся видимой при прокрутке */}
      <div className={styles.stickyHeader} ref={headerRef}>
        {/* Полоска хедера с фоном — только она имеет тёмный фон и блюр */}
        <div className={styles.headerBar}>
          <SiteHeader
            onAccessibilityClick={() => setA11yOpen(!a11yOpen)}
            onTrackerClick={() => setTrackerOpen(!trackerOpen)}
          />
        </div>

        {/* Выпадающие панели — абсолютно позиционированы, не создают фон за собой */}
        {(a11yOpen || trackerOpen) && (
          <div className={styles.dropdown}>
            {a11yOpen && <AccessibilityPanel />}
            {trackerOpen && <ReadingTracker />}
          </div>
        )}
      </div>

      {/* Декоративная шапка с фото рассвета/заката — на всю ширину экрана */}
      <MountainHeader
        mode={activeTab === 'morning' ? 'morning' : 'evening'}
        azkarCount={list.length}
        onStartReading={scrollToCards}
      />

      <main className={styles.main}>
        {/* Переключатель между утренними и вечерними азкарами */}
        <nav className={styles.tabs} ref={tabsRef}>
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

        {/* Полоска прогресса — показывает процент завершённых азкаров на текущей вкладке */}
        <div className={styles.progressBar}>
          <div
            className={`${styles.progressFill} ${progressPercent === 100 ? styles.progressDone : ''}`}
            style={{ width: `${progressPercent}%` }}
          />
          <span className={styles.progressText}>{progressPercent}%</span>
        </div>

        {/* Список карточек азкаров для выбранной вкладки */}
        <section className={styles.list} ref={listRef}>
          {list.map((azkar, i) => (
            <div
              key={azkar.id}
              id={`card-${i}`}
              className={styles.cardAnimate}
            >
              <AzkarCard
                azkar={azkar}
                index={i}
                tab={activeTab}
                onComplete={handleComplete}
                onFinished={() => {
                  /* Через 400ms плавно прокручивает к следующей карточке */
                  const nextId = `card-${i + 1}`;
                  setTimeout(() => {
                    document.getElementById(nextId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 400);
                }}
              />
            </div>
          ))}
        </section>

        {/* Мотивационный блок о пользе чтения азкаров */}
        <AzkarBenefit />

        {/* Кнопка поддержки автора внизу страницы */}
        <DonateButton />
      </main>

      {/* Кнопка прокрутки наверх — появляется при прокрутке вниз */}
      <ScrollToTop />
    </>
  );
}
