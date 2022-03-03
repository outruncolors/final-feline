import { ReactNode } from "react";
import { ScreenKind, screens } from "../data";
import { state } from "./state";

const changeLog = (kind: "misc" | "error", message: string) => {
  state.log.unshift({ kind, message });
};

const notify = (message: ReactNode, duration = 3000) => {
  state.notifications.unshift({
    message,
    duration,
  });
};

const changeScreen = (screen: ScreenKind, animation?: string) => {
  const entry = screens[screen];

  if (entry) {
    state.screen.which = screen;

    if (animation) {
      state.screen.animation = animation;
    }

    changeFuzzing();
  }
};

const changeFuzzing = () => {
  state.screen.fuzzing = true;
  setTimeout(() => (state.screen.fuzzing = false), 2000);
};

const addDialogue = (name: string, content: string) => {
  state.dialogue.push({
    name,
    avatar: name,
    text: content,
  });
};

const nextDialogue = () => {
  state.dialogue.shift();
};

const finishDialogue = () => {
  state.dialogue = [];
};

export const changers = {
  changeLog,
  notify,
  changeScreen,
  changeFuzzing,
  addDialogue,
  nextDialogue,
  finishDialogue,
};
