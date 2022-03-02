import { ScreenKind, screens } from "../data";
import { state } from "./state";

const changeLog = (kind: "misc" | "error", message: string) => {
  state.log.unshift({ kind, message });
};

const changeNotifications = (message: string) => {
  state.notifications.unshift(message);
};

const changeScreen = (screen: ScreenKind) => {
  const entry = screens[screen];

  if (entry) {
    state.screen.which = screen;
  }
};

export const changers = {
  changeLog,
  changeNotifications,
  changeScreen,
};
