import { ReactNode } from "react";
import * as PIXI from "pixi.js";
import { makeAutoObservable } from "mobx";
import { ScreenKind } from "../data";

export type GameState = ReturnType<typeof initState>;
export type GameStateProperty = keyof GameState;

// === config
const config = {
  SCREEN_SIZE: [1920 / 2, 1080 / 2],
};

const initState = () => {
  const [width, height] = config.SCREEN_SIZE;
  const app = new PIXI.Application({ width, height });
  const screen = new PIXI.Container();

  app.stage.addChild(screen);
  app.renderer.render(app.stage);

  return {
    app,
    ticks: 0,
    screen: {
      container: screen,
      which: null as null | ScreenKind,
      animation: null as null | string,
      width,
      height,
      fuzzing: false,
    },
    notifications: [] as Array<{ message: ReactNode; duration: number }>,
    log: [{ kind: "misc", message: "--- Start ---" }],
  };
};

export let state = initState();

makeAutoObservable(state);
