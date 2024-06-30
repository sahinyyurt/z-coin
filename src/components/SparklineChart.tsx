import { StyleSheet, View } from "react-native";
import React from "react";
import { CartesianChart, Line } from "victory-native";

type ChartData = { price: number; date: number };

type Props = {
  chartData: ChartData[];
  positive: boolean;
};

const SparklineChart = ({ chartData, positive }: Props) => {
  return (
    <View style={styles.container}>
      <CartesianChart data={chartData} xKey="date" yKeys={["price"]}>
        {({ points }) => (
          <Line
            points={points.price}
            color={!positive ? "#D90429" : "#21BF73"}
            strokeWidth={1.5}
          />
        )}
      </CartesianChart>
    </View>
  );
};

export default SparklineChart;

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 25,
  },
});
