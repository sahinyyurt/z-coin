// import 'whatwg-fetch';
import "react-native-gesture-handler/jestSetup";
import "@testing-library/jest-native/extend-expect";
import "@shopify/react-native-skia/jestSetup.js";
import { View } from "react-native";
import { createElement } from "react";

jest.mock("react-native-reanimated", () =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  require("react-native-reanimated/mock")
);

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

const PlainView = ({ children, ...props }) =>
  createElement(View, props, children);
const noop = () => null;

jest.mock("@shopify/react-native-skia", () => {
  const mock = {
    // other props can be added which
    // aren't handled properly
    // by the handler
    Canvas: PlainView,
  };
  const handler = {
    get(_, prop, __) {
      // first look for the prop in the mock
      if (prop in mock) {
        return mock[prop];
      }
      // class case? return a view
      if (prop[0] === prop[0].toUpperCase()) {
        return PlainView;
      }
      // probably a method
      return noop;
    },
  };
  return new Proxy(mock, handler);
});
