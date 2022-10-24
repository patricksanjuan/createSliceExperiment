import { Provider } from 'react-redux';
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import store from '../store';

import App from "../App";

describe("App.js", () => {
  let container = null;

  const renderComponent = () => {
    container = render(<Provider store={store}><App /></Provider>).container;
  };

  it("renders component" , () => {
    renderComponent();
    expect(screen.queryByText("Click!")).toBeTruthy();
    expect(screen.queryByText("details")).toBeTruthy();
  })
})