import { screens } from "../data";
import { state } from "./state";

const selectScreenTitle = () => {
  if (state.screen.which) {
    const screen = screens[state.screen.which];
    return screen.title;
  } else {
    return "Unknown";
  }
};

export const selectors = {
  selectScreenTitle,
};
