/*
  Это главная страница сайта с азкарами.
  Она показывает список утренних или вечерних азкаров — на выбор пользователя.
  Человек нажимает на вкладку «Утренние» или «Вечерние», и список меняется.
*/
'use client';
import { useState } from 'react';
import { morningAzkar, eveningAzkar } from '@/data/azkar';
import AzkarCard from '@/components/AzkarCard/AzkarCard';
import styles from './page.module.css';

type Tab = 'morning' | 'evening';

export default function Home() {
  // Запоминает, какая вкладка сейчас выбрана: утренние или вечерние азкары
  const [activeTab, setActiveTab] = useState<Tab>('morning');
  const list = activeTab === 'morning' ? morningAzkar : eveningAzkar;

  return (
    <main className={styles.main}>
      {/* Шапка страницы с заголовком на арабском и подзаголовком */}
      <header className={styles.header}>
        <h1 className={styles.title}>أَذْكَار</h1>
        <p className={styles.subtitle}>Утренние и вечерние азкары</p>
      </header>

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
          <AzkarCard key={azkar.id} azkar={azkar} index={i} />
        ))}
      </section>
    </main>
  );
}
