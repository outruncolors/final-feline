import * as PIXI from "pixi.js";
import throttle from "lodash.throttle";
import { state } from "../state";
import { selectors } from "./selectors";

// Handle each frame update.
const handleGameTick = () => {
  if (selectors.selectFuzzing(state)) {
    randomizeFuzzerNoise();
  }
};

export const beginTrackingTicks = () => {
  PIXI.Ticker.shared.add(handleGameTick);
};

const randomizeFuzzerNoise = throttle(() => {
  const fuzzer = selectors
    .selectScreenContainer(state)
    .getChildByName("fuzzer");
  const [noise] = fuzzer?.filters ?? [];

  if (fuzzer && noise) {
    (noise as any).seed = Math.random();
  }
}, 100);
