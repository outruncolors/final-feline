import * as Ant from "antd";
import { IObjectDidChange, observe } from "mobx";
import { loadScreenAnimations } from "../common";
import { GameState, GameStateProperty, state } from "./state";

export type GameStateChangeHandler = (
  change: IObjectDidChange<GameState>
) => void;

const noop = () => {};

const handleScreenChange: GameStateChangeHandler = () => {
  if (state.screen.which) {
    const animations = loadScreenAnimations(state.screen.which);

    const { animation } = state.screen;
    const [defaultAnimation] = Object.values(animations);
    const animationToUse = animation ? animations[animation] : defaultAnimation;

    if (animationToUse) {
      state.screen.container.addChild(animationToUse);
    }
  }
};
observe(state.screen, handleScreenChange);

const handleNotificationsChange: GameStateChangeHandler = () => {
  const newest = state.notifications[0];
  Ant.notification.open({
    message: newest,
    style: {
      position: "absolute",
      top: 200,
      right: 535,
    },
  });
};
observe(state.notifications, handleNotificationsChange);

const handleLogChange: GameStateChangeHandler = () => {
  const newest = { ...state.log[0] };
  console.log(`Log) [${newest.kind}]: `, newest.message);
};
observe(state.log, handleLogChange);

export const handlers: Record<GameStateProperty, GameStateChangeHandler> = {
  app: noop,
  ticks: noop,
  screen: handleScreenChange,
  notifications: handleNotificationsChange,
  log: handleLogChange,
};
