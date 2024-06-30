export interface CoinGeckoAsset {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: string | null;
  last_updated: string;
  price_change_percentage_1h: number;
  sparkline_in_7d: { price: number[] };
}

export interface GetAssetsWithMarketData {
  page?: number;
  perPage?: number;
  currency?: string;
  orderBy?: string;
  precision?: number;
}

export interface CoinGeckoAssetChartData {
  prices: number[][];
  market_caps: number[][];
  total_volumes: number[][];
}

export interface GetAssetWithMarketDataByIdParams {
  id: string;
  currency?: string;
  startAt?: number;
  endAt?: number;
}
