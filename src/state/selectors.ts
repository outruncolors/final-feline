import { screens } from "../data";
import { state } from "./state";

const selectFuzzing = () => state.screen.fuzzing;

const selectScreenName = () => state.screen.which;

const selectScreenTitle = () => {
  if (state.screen.which) {
    const screen = screens[state.screen.which];
    return screen.title;
  } else {
    return "Unknown";
  }
};

const selectScreenContainer = () => state.screen.container;

const selectPlayerData = () => ({ ...state.player });

export const selectors = {
  selectFuzzing,
  selectScreenName,
  selectScreenTitle,
  selectScreenContainer,
  selectPlayerData,
};
