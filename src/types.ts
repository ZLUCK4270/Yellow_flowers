export interface FlowerData {
  id: string;
  name: string;
  scientificName: string;
  meaning: string;
  quote: string;
  scale?: number;
  initialBloomProgress?: number;
  type: 'sunflower' | 'daisy' | 'rose' | 'tulip' | 'narcissus';
}

export type SunsetPhase = 'goldenHour' | 'deepSunset' | 'twilight' | 'radiantDusk';

export interface DedicationMessage {
  recipient: string;
  sender: string;
  message: string;
  flowerType: string;
  date: string;
}
