'use client';
import { useRef, useState } from 'react';
import styles from './AzkarAudio.module.css';

interface AzkarAudioProps {
  src: string; // e.g. "/audio/azkar-01.mp3"
}

export default function AzkarAudio({ src }: AzkarAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);
  const [progress, setProgress] = useState(0);

  if (!available) return null;

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

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    setProgress((audio.currentTime / audio.duration) * 100);
  };

  const handleEnded = () => {
    setPlaying(false);
    setProgress(0);
  };

  const handleError = () => {
    setAvailable(false);
  };

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
