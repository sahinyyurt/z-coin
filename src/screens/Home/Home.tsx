import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
} from "react-native";
import React from "react";
import CoinCard from "@/components/CoinCard";
import { FlashList } from "@shopify/flash-list";
import { useCoinList } from "@/hooks/useCoinList";
import { Color } from "@/utils/constants";
const Home = () => {
  const { data, getNextPage, isLoading } = useCoinList();
  const { height, width } = useWindowDimensions();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.head}>Trending</Text>
      {isLoading && (
        <ActivityIndicator
          size={"large"}
          color={Color.red}
          style={[
            styles.loading,
            {
              top: height / 2,
              left: width / 2 - 30,
            },
          ]}
        />
      )}
      <FlashList
        data={data}
        estimatedItemSize={100}
        keyExtractor={(item) => item.id}
        onEndReached={() => {
          if (data.length > 0 && !isLoading) getNextPage();
        }}
        renderItem={({ item }) => (
          <CoinCard
            id={item.id}
            key={item.id}
            changefor24={item.price_change_percentage_24h}
            code={item.symbol}
            name={item.name}
            image={item.image}
            price={item.current_price}
            sparkline={item.sparkline_in_7d.price}
          />
        )}
        contentContainerStyle={styles.listInner}
      />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%", justifyContent: "center" },
  head: { fontSize: 24, fontWeight: "600" },
  loading: {
    zIndex: 9,
    position: "absolute",
  },
  listInner: {
    paddingHorizontal: 12,
  },
});
