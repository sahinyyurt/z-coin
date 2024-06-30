import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Binance from "@/services/binance";
import AnimatedText from "./AnimatedText";
import SparklineChart from "./SparklineChart";
import { Color } from "@/utils/constants";

type Props = {
  id: string;
  name: string;
  code: string;
  image: string;
  price: number;
  changefor24: number;
  sparkline: number[];
};

const CoinCard = ({
  id,
  changefor24,
  code,
  image,
  name,
  price,
  sparkline: _sparkline,
}: Props) => {
  const [coinPrice, setCoinPrice] = useState(price);
  const [coinPercent, setCoinPercent] = useState(changefor24);
  const [sparkline, setSparkline] = useState(_sparkline);
  const priceRef = useRef(price);
  const positive = coinPercent > 0;

  const chartData = sparkline.map((x, i) => ({
    date: i,
    price: x,
  }));
  useEffect(() => {
    return Binance.instance().subscribePrice(`${code}usdt`, (newPrice) => {
      if (priceRef.current == newPrice.price) return;
      console.log(code, newPrice, coinPrice);
      setCoinPrice(newPrice.price);
      priceRef.current = newPrice.price;
      setCoinPercent(newPrice.percentage);
    });
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Image
          source={{
            uri: image,
          }}
          style={styles.icon}
        />
        <View style={styles.gap6}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.symbol}>{code.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.priceContainer}>
        <SparklineChart positive={positive} chartData={chartData} />

        <View style={styles.right}>
          <AnimatedText
            style={styles.name}
            text={"$" + coinPrice.toLocaleString()}
          />
          <AnimatedText
            style={StyleSheet.flatten([
              styles.font14,
              ,
              {
                color: !positive ? Color.red : Color.green,
              },
            ])}
            text={coinPercent.toLocaleString() + "%"}
          />
        </View>
      </View>
    </View>
  );
};

export default CoinCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#fff",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 24,
    marginVertical: 10,
    borderRadius: 10,
    height: 100,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    gap: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
    gap: 0,
  },
  font14: { fontSize: 14 },
  name: { fontSize: 24, fontWeight: "600" },
  symbol: { fontSize: 18, color: "#6C757D" },
  right: { alignItems: "flex-end", gap: 6 },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    overflow: "hidden",
  },
  icon: {
    width: 40,
    aspectRatio: 1,
  },
  gap6: { gap: 6 },
});
