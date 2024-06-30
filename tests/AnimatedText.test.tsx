import { render } from "@testing-library/react-native";
import AnimatedText from "@/components/AnimatedText";

describe("AnimatedText", () => {
  test("Should render text", () => {
    const component = <AnimatedText text="test" />;
    const { getAllByText } = render(component);
    expect(getAllByText("test")).toBeDefined();
  });
});
