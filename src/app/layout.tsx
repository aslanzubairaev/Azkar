/*
  Этот файл — корневая оболочка всего сайта.
  Он подключает шрифты (Inter для текста, Noto Sans для транслитерации,
  Noto Naskh Arabic для арабских букв) и задаёт общие метаданные страницы.
  Всё содержимое сайта отображается внутри него.
*/
import type { Metadata } from 'next';
import { Inter, Noto_Naskh_Arabic, Noto_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
});

// Noto Sans — для транслитерации: корректно отображает знаки ударения над кириллицей
const notoSans = Noto_Sans({
  subsets: ['latin', 'cyrillic'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-noto-sans',
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-arabic',
});

export const metadata: Metadata = {
  title: 'Азкары — Утренние и Вечерние',
  description: 'Утренние и вечерние азкары с арабским текстом, переводом и аудио',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${notoSans.variable} ${notoNaskhArabic.variable}`}>
      <body>{children}</body>
    </html>
  );
}
