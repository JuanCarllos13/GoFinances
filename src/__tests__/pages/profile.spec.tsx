import React from "react";
import { render } from "@testing-library/react-native";

import { Profile } from "../../pages/profile";

describe("Profile", () => {
  it("Valor do PlaceholderText", () => {
    const { getByPlaceholderText } = render(<Profile />);

    const inputName = getByPlaceholderText("Nome");

    expect(inputName.props.placeholder).toBeTruthy();
  });

  it("Check if user data has been loaded", () => {
    const { getByTestId } = render(<Profile />);

    const inputName = getByTestId("input-name");
    const inpurnsname = getByTestId("input-surname");

    expect(inputName.props.value).toEqual("Juan");
    expect(inpurnsname.props.value).toEqual("Amaral");
  });

  it("checks if title render correctly", () => {
    const { getByTestId } = render(<Profile />);

    const titleText = getByTestId("title");

    expect(titleText.props.children).toContain("Testando");
  });
});
