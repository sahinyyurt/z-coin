import {
  BinanceTickerMessage,
  PriceChange,
  PriceSubscription,
} from "@/types/binance";

import { CoinGeckoAsset } from "@/types/coingecko";

class Queuer {
  private queue: (() => Promise<void>)[] = [];
  private running: boolean = false;
  public run(action: () => Promise<void>) {
    const that = this;
    if (!that.running) {
      that.running = true;
      action().finally(async () => {
        while (that.queue.length > 0) {
          await that.queue.shift()?.();
        }
        that.running = false;
      });
    } else {
      that.queue.push(action);
    }
  }
  public destroy() {
    this.running = false;
    this.queue = [];
  }
}

class Binance {
  private ws: WebSocket | null;
  private priceSubs: Map<string, PriceSubscription[]>;
  private subscribeQueue: Queuer;
  private unsubscribeQueue: Queuer;
  public constructor() {
    this.ws = null;
    this.subscribeQueue = new Queuer();
    this.unsubscribeQueue = new Queuer();
    this.priceSubs = new Map();
    this.connect();
  }

  public subscribePrice(
    symbol: string,
    onPrice: (priceChanges: PriceChange) => void
  ) {
    const symbolUpperCase = symbol.toUpperCase();
    if (!this.priceSubs.has(symbolUpperCase)) {
      this.subscribe(symbolUpperCase);
    }
    const sub = this.priceSubs.get(symbolUpperCase) || [];

    const subId = Date.now();
    this.priceSubs.set(
      symbolUpperCase,
      sub.concat({ id: subId, action: onPrice })
    );
    const that = this;
    return () => {
      this.unsubscribePrice(symbol);
      that.priceSubs.set(
        symbolUpperCase,
        sub.filter((x) => x.id !== subId)
      );
    };
  }

  private async unsubscribePrice(product_id: string) {
    const sub = this.priceSubs.get(product_id.toUpperCase());
    if (!sub || sub.length < 1) return;

    const { id } = sub[0];

    this.unsubscribeQueue.run(async () => {
      try {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws?.send(
            JSON.stringify({
              method: "UNSUBSCRIBE",
              params: [`${product_id.toLowerCase()}@ticker`],
              id,
            })
          );
        } else {
          setTimeout(() => this.unsubscribePrice(product_id), 1000); // retry
        }
      } catch (err) {
        console.error(
          "Error while unsubscribing on binance for " + product_id,
          err
        );
      }
      // Binance Rate Limit
      await this.delay(2000);
    });
  }

  private async subscribe(product_id: string) {
    this.subscribeQueue.run(async () => {
      try {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws?.send(
            JSON.stringify({
              method: "SUBSCRIBE",
              params: [`${product_id.toLowerCase()}@ticker`],
              id: Date.now(),
            })
          );
        } else {
          setTimeout(() => this.subscribe(product_id), 1000); // retry
        }
      } catch (err) {
        console.error(
          "Error while subscribing on binance for " + product_id,
          err
        );
      }
      await this.delay(2000); // Binance rate limiting
    });
  }

  private delay(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  private connect() {
    const that = this;
    this.ws?.close();
    that.ws = new WebSocket("wss://stream.binance.com:9443/ws");
    that.ws.onopen = () => {
      that.ws!.onmessage = ({ data }) => {
        const parsed: BinanceTickerMessage = JSON.parse(data.toString());
        if ("s" in parsed) {
          that.priceSubs.get(parsed.s)?.forEach((s) =>
            s.action({
              price: parseFloat(parsed.c),
              percentage: parseFloat(parsed.P),
            })
          );
        }
      };
    };
    that.ws.onclose = () => {
      setTimeout(() => {
        that.subscribeQueue.destroy();
        that.unsubscribeQueue.destroy();
        that.connect();
        [...that.priceSubs.keys()].forEach((k) => that.subscribe(k));
      }, 1000);
    };
  }

  public getChartData({ symbol }: any) {
    return get(`/klines?symbol=${symbol.toUpperCase()}&interval=4h`).then(
      (res) => (res.ok ? res.json() : Promise.reject(res.text()))
    );
  }

  public async getCoinList({
    page = 1,
    perPage = 10,
    currency = "usd",
    orderBy = "market_cap_desc",
    precision = 2,
  }): Promise<CoinGeckoAsset[]> {
    await this.delay(2000);
    return getGecko(
      `coins/markets?order=${orderBy}&per_page=${perPage}&precision=${precision}&vs_currency=${currency}&page=${page}&sparkline=true&category=layer-1`
    ).then((res) =>
      res.ok
        ? (res.json() as unknown as CoinGeckoAsset[])
        : Promise.reject(res.text())
    );
  }

  public ticker(product_id: string): Promise<{
    symbol: string;
    price: string;
  }> {
    return get(`/ticker/price?symbol=${product_id.toUpperCase()}`).then((res) =>
      res.ok ? res.json() : Promise.reject(res.text())
    );
  }
}

function get(endpoint: string) {
  return fetch(`${process.env.EXPO_PUBLIC_BINANCE_API_BASE_URL}/${endpoint}`, {
    method: "GET",
  });
}

function getGecko(endpoint: string) {
  return fetch(
    `${process.env.EXPO_PUBLIC_COIN_GECKO_API_BASE_URL}/${endpoint}`,
    { method: "GET" }
  );
}

let instance: Binance | null = null;
function getInstance(): Binance {
  if (instance === null) {
    instance = new Binance();
  }
  return instance;
}

export default {
  instance: getInstance,
};
