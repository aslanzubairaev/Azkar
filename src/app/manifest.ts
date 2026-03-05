export default function manifest() {
  return {
    name: 'Азкары — Утренние и Вечерние',
    short_name: 'Азкары',
    description: 'Утренние и вечерние азкары с арабским текстом и переводом',
    start_url: '/',
    display: 'standalone',
    background_color: '#252829',
    theme_color: '#252829',
    icons: [
      { src: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
