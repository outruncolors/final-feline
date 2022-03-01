import * as PIXI from "pixi.js";
import { IObjectDidChange, makeAutoObservable, observe } from "mobx";

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

    console.log({ handler });

    handler.call(null, change);
  } catch (error) {
    state.log.push({
      kind: "error",
      message: `Error: Unable to handle change.`,
    });
  }
});

// === changers
export const getChangers = () => ({
  changeLog,
});

const changeLog = (kind: "misc" | "error", message: string) => {
  state.log.unshift({ kind, message });
};

// === handlers
type GameStateChangeHandler = (change: IObjectDidChange<GameState>) => void;

const getHandlers = (): Record<GameStateProperty, GameStateChangeHandler> => ({
  app: noop,
  ticks: noop,
  screen: handleScreenChange,
  log: handleLogChange,
});

const handleScreenChange: GameStateChangeHandler = (change) => {};

const handleLogChange: GameStateChangeHandler = (change) => {
  const newest = { ...state.log[0] };
  console.log(`Log) [${newest.kind}]: `, newest.message);
};

const noop = () => {};

observe(state.log, handleLogChange);
