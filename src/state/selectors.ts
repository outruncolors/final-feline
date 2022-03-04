import { screens } from "../data";
import { MyGameState } from "./state";

const selectFuzzing = (state: MyGameState) => state.screen.fuzzing;

const selectScreenName = (state: MyGameState) => state.screen.which;

const selectScreenTitle = (state: MyGameState) => {
  if (state.screen.which) {
    const screen = screens[state.screen.which];
    return screen.title;
  } else {
    return "Unknown";
  }
};

const selectScreenContainer = (state: MyGameState) => state.screen.container;

const selectPlayerData = (state: MyGameState) => ({ ...state.player });

const selectDialogue = (state: MyGameState) => state.dialogue[0] ?? null;

const selectDialogueCount = (state: MyGameState) => state.dialogue.length;

const selectActiveMenu = (state: MyGameState) => state.menu;

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
