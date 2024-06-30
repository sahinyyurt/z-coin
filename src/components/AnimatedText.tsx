import { StyleSheet, TextStyle } from "react-native";
import React, { PropsWithChildren, useEffect } from "react";
import Animated, {
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { usePreviousValue } from "@/hooks/usePreviousValue";

type Props = PropsWithChildren<{ style?: TextStyle; text: string }>;

const AnimatedText = ({ text, style }: Props) => {
  const animation = useSharedValue(1);
  const prevText = usePreviousValue(text);
  useEffect(() => {
    if (prevText !== text && prevText) {
      animation.value = withSequence(
        withTiming(0.1, { duration: 500 }),
        withTiming(1, { duration: 500 })
      );
    }
  }, [text]);
  return (
    <Animated.Text style={[style, { opacity: animation }]}>
      {text}
    </Animated.Text>
  );
};

export default AnimatedText;

const styles = StyleSheet.create({});
