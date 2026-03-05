export default function sitemap() {
  return [
    { url: '/', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 1 },
  ];
}
