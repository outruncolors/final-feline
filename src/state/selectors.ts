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

const selectDialogue = () => {
  try {
    const newest = { ...state.dialogue[0] };

    if (newest.hasOwnProperty("name")) {
      return newest;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

const selectDialogueCount = () => state.dialogue.length;

export const selectors = {
  selectFuzzing,
  selectScreenName,
  selectScreenTitle,
  selectScreenContainer,
  selectPlayerData,
  selectDialogue,
  selectDialogueCount,
};
