export type VisionHit = {
  name: string;
  brand: string | null;
  category: string;
  details: string[];
};

export type Comp = {
  title: string;
  price: number;
  link: string;
  source: string;
};

export type PriceRange = {
  low: number;
  typical: number;
  high: number;
};

export type ScanResult = {
  photoUri: string;
  vision: VisionHit;
  comps: Comp[];
  range: PriceRange;
};
