/*
  Это аудиоплеер для прослушивания азкара.
  Он показывает кнопку «Воспроизвести/Пауза» и полосу прогресса.
  Человек может нажать кнопку или кликнуть по полосе, чтобы перемотать.
  Если аудиофайл недоступен, плеер автоматически скрывается.
*/
'use client';
import { useRef, useState } from 'react';
import styles from './AzkarAudio.module.css';

interface AzkarAudioProps {
  src: string; // e.g. "/audio/azkar-01.mp3"
}

export default function AzkarAudio({ src }: AzkarAudioProps) {
  // Ссылка на HTML-элемент аудио, чтобы управлять воспроизведением
  const audioRef = useRef<HTMLAudioElement>(null);
  // Запоминает, играет ли сейчас аудио
  const [playing, setPlaying] = useState(false);
  // Запоминает, доступен ли аудиофайл (скрывает плеер если файл не найден)
  const [available, setAvailable] = useState(true);
  // Запоминает текущий прогресс воспроизведения в процентах (0–100)
  const [progress, setProgress] = useState(0);

  if (!available) return null;

  // Запускает или ставит на паузу воспроизведение по нажатию кнопки
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => setAvailable(false));
      setPlaying(true);
    }
  };

  // Обновляет полосу прогресса во время воспроизведения
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    setProgress((audio.currentTime / audio.duration) * 100);
  };

  // Сбрасывает состояние когда аудио закончилось
  const handleEnded = () => {
    setPlaying(false);
    setProgress(0);
  };

  // Скрывает плеер если аудиофайл не загрузился
  const handleError = () => {
    setAvailable(false);
  };

  // Перематывает аудио в то место, куда кликнул пользователь на полосе прогресса
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
  };

  return (
    <div className={styles.player}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={handleError}
        preload="none"
      />
      <button
        className={`${styles.playBtn} ${playing ? styles.playing : ''}`}
        onClick={togglePlay}
        aria-label={playing ? 'Пауза' : 'Слушать'}
      >
        {playing ? '❚❚' : '▶'}
      </button>
      <div className={styles.progressBar} onClick={handleSeek}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
