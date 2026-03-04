type AzkarTime = 'morning' | 'evening' | 'both';

export interface AzkarItem {
  id: number;
  title: string;
  transliteration: string;
  arabic: string;
  translation: string;
  time: AzkarTime;
  count: number;
}
