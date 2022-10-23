import React from "react";
import { render } from "@testing-library/react-native";
import { ThemeProvider } from "styled-components/native";
import theme from "../../../global/styles/theme";

import { Input } from ".";

function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

describe("Input components", () => {
  it("must have specific border color when active", () => {
    const { getByTestId, debug } = render(
      <Input
        testID="input-email"
        placeholder="email"
        keyboardType="email-address"
        autoCorrect={false}
        active={true}
      />,
      {
        wrapper: Providers,
      }
    );

    // debug();

    const inputComponents = getByTestId("input-email");

    expect(inputComponents.props.style[0].borderColor).toEqual(theme.colors.attention);

    expect(inputComponents.props.style[0].borderWidth).toEqual(3);
  });
});
