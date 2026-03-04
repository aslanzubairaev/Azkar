/*
  Этот файл — корневая оболочка всего сайта.
  Он подключает шрифты (Playfair Display для заголовков и номеров,
  Source Serif 4 для основного текста и переводов,
  Noto Sans для транслитерации, Noto Naskh Arabic для арабских букв),
  добавляет anti-FOUC скрипт для предотвращения мигания темы,
  и задаёт общие метаданные страницы.
  Всё содержимое сайта отображается внутри него.
*/
import type { Metadata } from 'next';
import { Playfair_Display, Source_Serif_4, Noto_Naskh_Arabic, Noto_Sans } from 'next/font/google';
import './globals.css';

// Playfair Display — для заголовков, названий, номеров азкаров
const playfairDisplay = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
});

// Source Serif 4 — для основного текста и переводов
const sourceSerif4 = Source_Serif_4({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-body',
});

// Noto Sans — для транслитерации: корректно отображает знаки ударения над кириллицей
const notoSans = Noto_Sans({
  subsets: ['latin', 'cyrillic'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-noto-sans',
});

// Noto Naskh Arabic — для отображения арабского текста молитв
const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-arabic',
});

export const metadata: Metadata = {
  title: 'Азкары — Утренние и Вечерние',
  description: 'Утренние и вечерние азкары с арабским текстом, переводом и аудио',
};

/* Скрипт, который выполняется до отрисовки страницы — восстанавливает сохранённую тему,
   размеры шрифтов (арабский, транскрипция, перевод) и контраст,
   чтобы страница не мигала при загрузке */
const antiFouc = `
(function(){
  try {
    var d = document.documentElement;
    var t = localStorage.getItem('azkar-theme');
    d.setAttribute('data-theme', t || 'dark');
    var c = localStorage.getItem('azkar-contrast');
    if (c) d.setAttribute('data-contrast', c);
    var a = localStorage.getItem('azkar-font-arabic');
    if (a) d.style.setProperty('--font-size-arabic', a + 'rem');
    var tr = localStorage.getItem('azkar-font-translit');
    if (tr) d.style.setProperty('--font-size-translit', tr + 'rem');
    var tl = localStorage.getItem('azkar-font-translation');
    if (tl) d.style.setProperty('--font-size-translation', tl + 'rem');
  } catch(e){}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" data-theme="dark" className={`${playfairDisplay.variable} ${sourceSerif4.variable} ${notoSans.variable} ${notoNaskhArabic.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: antiFouc }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
