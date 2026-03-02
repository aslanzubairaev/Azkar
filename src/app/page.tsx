/*
  Это главная страница сайта с азкарами.
  Она показывает декоративную шапку с горными пиками (MountainHeader),
  затем список утренних или вечерних азкаров — на выбор пользователя.
  Человек нажимает на вкладку «Утренние» или «Вечерние», и список меняется.
  Карточки появляются с небольшой задержкой поочерёдно (анимация).
*/
'use client';
import { useState } from 'react';
import { morningAzkar, eveningAzkar } from '@/data/azkar';
import AzkarCard from '@/components/AzkarCard/AzkarCard';
import styles from './page.module.css';
import MountainHeader from '@/components/MountainHeader/MountainHeader';

type Tab = 'morning' | 'evening';

export default function Home() {
  // Запоминает, какая вкладка сейчас выбрана: утренние или вечерние азкары
  const [activeTab, setActiveTab] = useState<Tab>('morning');
  // Список азкаров для выбранной вкладки
  const list = activeTab === 'morning' ? morningAzkar : eveningAzkar;

  return (
    <main className={styles.main}>
      {/* Декоративная шапка с горными пиками и заголовком */}
      <MountainHeader />

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
      <section className={styles.list}>
        {list.map((azkar, i) => (
          <div
            key={azkar.id}
            className={styles.cardAnimate}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <AzkarCard azkar={azkar} index={i} />
          </div>
        ))}
      </section>
    </main>
  );
}
