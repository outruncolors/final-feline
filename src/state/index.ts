import { observe } from "mobx";
import { GameStateProperty, state } from "./state";
import { changers } from "./changers";
import { handlers } from "./handlers";
import { selectors } from "./selectors";
import { beginTrackingTicks } from "./tick";

observe(state, (change) => {
  try {
    const { name } = change;
    const asProperty = name as GameStateProperty;
    const handler = handlers[asProperty];

    handler.call(null, change);
  } catch (error) {
    changers.changeLog("error", "Unable to handle change.");
  }
});

export { changers, selectors, beginTrackingTicks };
export * from "./state";
