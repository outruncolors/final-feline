import * as PIXI from "pixi.js";
import { IObjectDidChange, makeAutoObservable, observe } from "mobx";
import { ScreenKind, screens } from "./data";
import { loadScreenAnimations } from "./common";

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
      width,
      height,
    },
    log: [{ kind: "misc", message: "--- Start ---" }],
  };
};

export let state = initState();

makeAutoObservable(state);

observe(state, (change) => {
  try {
    const { name } = change;
    const asProperty = name as GameStateProperty;
    const handlers = getHandlers();
    const handler = handlers[asProperty];

    handler.call(null, change);
  } catch (error) {
    changeLog("error", "Unable to handle change.");
  }
});

// === changers
export const getChangers = () => ({
  changeLog,
  changeScreen,
});

const changeLog = (kind: "misc" | "error", message: string) => {
  state.log.unshift({ kind, message });
};

const changeScreen = (screen: ScreenKind) => {
  const entry = screens[screen];

  if (entry) {
    state.screen.which = screen;
  }
};

// === handlers
type GameStateChangeHandler = (change: IObjectDidChange<GameState>) => void;

const getHandlers = (): Record<GameStateProperty, GameStateChangeHandler> => ({
  app: noop,
  ticks: noop,
  screen: handleScreenChange,
  log: handleLogChange,
});

const handleScreenChange: GameStateChangeHandler = (change) => {
  if (state.screen.which) {
    const animations = loadScreenAnimations(state.screen.which);

    if (animations.caught) {
      state.screen.container.addChild(animations.caught);
    }
  }
};
observe(state.screen, handleScreenChange);

const handleLogChange: GameStateChangeHandler = (change) => {
  const newest = { ...state.log[0] };
  console.log(`Log) [${newest.kind}]: `, newest.message);
};
observe(state.log, handleLogChange);

const noop = () => {};
