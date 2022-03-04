import * as PIXI from "pixi.js";
import throttle from "lodash.throttle";
import { selectors } from "./selectors";
import { state } from "./state";

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
  const container = selectors.selectScreenContainer(state);

  if (container) {
    const fuzzer = container.getChildByName("fuzzer");
    const [noise] = fuzzer?.filters ?? [];

    if (fuzzer && noise) {
      (noise as any).seed = Math.random();
    }
  }
}, 100);
