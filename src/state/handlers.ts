import * as Ant from "antd";
import * as PIXI from "pixi.js";
import { IObjectDidChange, observe } from "mobx";
import { colors, loadScreenAnimations } from "../common";
import { GameState, GameStateProperty, state } from "./state";

export type GameStateChangeHandler = (
  change: IObjectDidChange<GameState>
) => void;

const noop = () => {};

let rerender: null | (() => void) = null;
export const setRerender = (func: () => void) => (rerender = func);

const handleScreenChange: GameStateChangeHandler = (change) => {
  if (change.name === "which") {
    if (state.screen.which) {
      const animations = loadScreenAnimations(state.screen.which);

      const { animation } = state.screen;
      const [defaultAnimation] = Object.values(animations);
      const animationToUse = animation
        ? animations[animation]
        : defaultAnimation;

      if (animationToUse) {
        state.screen.container.addChild(animationToUse);
      }

      rerender?.();
    }
  }

  if (change.name === "fuzzing") {
    if ((change as any).newValue) {
      const fuzzer = new PIXI.Sprite(PIXI.Texture.WHITE);
      fuzzer.name = "fuzzer";
      fuzzer.width = state.screen.container.width;
      fuzzer.height = state.screen.container.height;
      const noise = new PIXI.filters.NoiseFilter();
      fuzzer.filters = [noise];
      fuzzer.tint = colors.black;
      state.screen.container.addChild(fuzzer);
    } else {
      const fuzzer = state.screen.container.getChildByName("fuzzer");

      if (fuzzer) {
        state.screen.container.removeChild(fuzzer);
      }
    }
  }
};
observe(state.screen, handleScreenChange);

const handleNotificationsChange: GameStateChangeHandler = () => {
  const { message } = state.notifications[0];

  Ant.notification.open({
    message,
    style: {
      position: "fixed",
      top: 200,
      right: 815,
      width: 400,
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
