export type BinanceTickerMessage = {
  A: string;
  B: string;
  C: number;
  E: number;
  F: number;
  L: number;
  O: number;
  P: string;
  Q: string;
  a: string;
  b: string;
  c: string;
  e: string;
  h: string;
  l: string;
  n: number;
  o: string;
  p: string;
  q: string;
  s: string;
  v: string;
  w: string;
  x: string;
};

export type PriceChange = { price: number; percentage: number };

export type PriceSubscription = {
  id: number;
  action: (priceChanges: PriceChange) => void;
};
