import binance from "@/services/binance";
import { CoinGeckoAsset } from "@/types/coingecko";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function useCoinList() {
  const [allData, setAllData] = useState<CoinGeckoAsset[]>([]);
  const [nextPage, setNextPage] = useState(1);
  const delay = (ms: number) => {
    return new Promise((r) => setTimeout(r, ms));
  };
  const { isLoading, error } = useQuery<CoinGeckoAsset[]>({
    queryKey: ["charlist", nextPage],
    queryFn: async () => {
      if (isLoading) {
        const res = await binance.instance().getCoinList({ page: nextPage });
        setAllData([...allData, ...res]);
        return res;
      }
      return [];
    },
  });

  const getNextPage = () => {
    setNextPage((prev) => prev + 1);
  };

  return { isLoading, data: allData, getNextPage, error };
}
