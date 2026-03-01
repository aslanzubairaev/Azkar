'use client';
import { useState } from 'react';
import { morningAzkar, eveningAzkar } from '@/data/azkar';
import AzkarCard from '@/components/AzkarCard/AzkarCard';
import styles from './page.module.css';

type Tab = 'morning' | 'evening';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('morning');
  const list = activeTab === 'morning' ? morningAzkar : eveningAzkar;

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>أَذْكَار</h1>
        <p className={styles.subtitle}>Утренние и вечерние азкары</p>
      </header>

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

      <section className={styles.list}>
        {list.map((azkar, i) => (
          <AzkarCard key={azkar.id} azkar={azkar} index={i} />
        ))}
      </section>
    </main>
  );
}
