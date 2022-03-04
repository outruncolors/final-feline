import { ReactNode } from "react";
import { ScreenKind, screens } from "../data";
import type { MenuKind } from "../components";
import type { MyGameState } from "./state";

const changeLog = (
  state: MyGameState,
  kind: "misc" | "error",
  message: string
) => {
  state.log.unshift({ kind, message });
};

const notify = (state: MyGameState, message: ReactNode, duration = 3000) => {
  state.notifications.unshift({
    message,
    duration,
  });
};

const changeScreen = (
  state: MyGameState,
  screen: ScreenKind,
  animation?: string
) => {
  const entry = screens[screen];

  if (entry) {
    state.screen.which = screen;

    if (animation) {
      state.screen.animation = animation;
    } else {
      state.screen.animation = entry.initialAnimation;
    }

    changeFuzzing(state);
  }
};

const changeFuzzing = (state: MyGameState) => {
  state.screen.fuzzing = true;
  setTimeout(() => (state.screen.fuzzing = false), 2000);
};

const addDialogue = (state: MyGameState, name: string, content: string) => {
  state.dialogue.push({
    name,
    avatar: name,
    text: content,
  });
};

const nextDialogue = (state: MyGameState) => {
  state.dialogue.shift();
};

const finishDialogue = (state: MyGameState) => {
  state.dialogue = [];
};

const changeMenu = (state: MyGameState, menu: null | MenuKind) => {
  state.menu = menu;
};

export const changers = {
  changeLog,
  notify,
  changeScreen,
  changeFuzzing,
  addDialogue,
  nextDialogue,
  finishDialogue,
  changeMenu,
};
