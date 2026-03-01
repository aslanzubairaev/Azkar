// src/types/azkar.ts
export type AzkarTime = 'morning' | 'evening' | 'both';

export interface AzkarItem {
  id: number;
  title: string;
  transliteration: string;
  arabic: string;
  translation: string;
  time: AzkarTime;
  count: number;
  audioFile?: string; // e.g. "azkar-01.mp3"
}
