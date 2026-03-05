/*
  Этот файл — логотип сайта в виде полумесяца со звездой.
  Он показывает тёмный круг с золотым полумесяцем и звёздочкой-ромбиком.
  Используется в шапке сайта рядом с названием «Азкары».
*/
import styles from './Logo.module.css';

interface LogoProps {
  size?: number;
}

export default function Logo({ size = 28 }: LogoProps) {
  return (
    <svg
      className={styles.logo}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Градиент для тёмного фона — тёмно-синий */}
        <linearGradient id="logoBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="50%" stopColor="#16213e" />
          <stop offset="100%" stopColor="#0f3460" />
        </linearGradient>

        {/* Градиент для золотого полумесяца */}
        <linearGradient id="logoMoon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0c27f" />
          <stop offset="100%" stopColor="#d4a44a" />
        </linearGradient>
      </defs>

      {/* Круглый тёмный фон */}
      <circle cx="16" cy="16" r="16" fill="url(#logoBg)" />

      {/* Полумесяц — разница двух кругов */}
      <mask id="moonMask">
        <rect width="32" height="32" fill="black" />
        <circle cx="13" cy="16" r="9" fill="white" />
        <circle cx="17.5" cy="14" r="7.5" fill="black" />
      </mask>
      <rect width="32" height="32" fill="url(#logoMoon)" mask="url(#moonMask)" />

      {/* Звезда-ромбик */}
      <rect
        x="21"
        y="10"
        width="4.5"
        height="4.5"
        rx="0.8"
        fill="url(#logoMoon)"
        transform="rotate(45 23.25 12.25)"
      />
    </svg>
  );
}
