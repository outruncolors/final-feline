import { ScreenKind, screens } from "../data";
import { state } from "./state";

const changeLog = (kind: "misc" | "error", message: string) => {
  state.log.unshift({ kind, message });
};

const changeNotifications = (message: string) => {
  state.notifications.unshift(message);
};

const changeScreen = (screen: ScreenKind, animation?: string) => {
  const entry = screens[screen];

  if (entry) {
    state.screen.which = screen;

    if (animation) {
      state.screen.animation = animation;
    }
  }
};

export const changers = {
  changeLog,
  changeNotifications,
  changeScreen,
};
