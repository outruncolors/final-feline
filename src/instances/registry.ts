import { initializePub } from "./pub";
import { initializeWorldMap } from "./world-map";

export const registry = {
  "/": initializeWorldMap,
  "/pub": initializePub,
};
