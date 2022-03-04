import { screens } from "../data";
import { GameState } from "./state";

const selectFuzzing = (state: GameState) => state.screen.fuzzing;

const selectScreenName = (state: GameState) => state.screen.which;

const selectScreenTitle = (state: GameState) => {
  if (state.screen.which) {
    const screen = screens[state.screen.which];
    return screen.title;
  } else {
    return "Unknown";
  }
};

const selectScreenContainer = (state: GameState) => state.screen.container;

const selectPlayerData = (state: GameState) => ({ ...state.player });

const selectDialogue = (state: GameState) => {
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

const selectDialogueCount = (state: GameState) => state.dialogue.length;

const selectActiveMenu = (state: GameState) => state.menu;

export const selectors = {
  selectFuzzing,
  selectScreenName,
  selectScreenTitle,
  selectScreenContainer,
  selectPlayerData,
  selectDialogue,
  selectDialogueCount,
  selectActiveMenu,
};
