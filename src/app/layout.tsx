import type { Metadata } from 'next';
import { Inter, Noto_Naskh_Arabic } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
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
    <html lang="ru" className={`${inter.variable} ${notoNaskhArabic.variable}`}>
      <body>{children}</body>
    </html>
  );
}
