import * as PIXI from "pixi.js";
import { selectors } from "./selectors";
import throttle from "lodash.throttle";

// Handle each frame update.
const handleGameTick = () => {
  if (selectors.selectFuzzing()) {
    randomizeFuzzerNoise();
  }
};

export const beginTrackingTicks = () => {
  PIXI.Ticker.shared.add(handleGameTick);
};

const randomizeFuzzerNoise = throttle(() => {
  const fuzzer = selectors.selectScreenContainer().getChildByName("fuzzer");
  const [noise] = fuzzer?.filters ?? [];

  if (fuzzer && noise) {
    (noise as any).seed = Math.random();
  }
}, 100);
