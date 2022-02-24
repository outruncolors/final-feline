import { initializePub } from "./pub";
import { initializePvEBattle } from "./pve-battle";
import { initializeWorldMap } from "./world-map";

export const registry = {
  "/": initializeWorldMap,
  "/pub": initializePub,

  // PvE Battle Locations
  "/beach": initializePvEBattle("beach"),
  "/cave": initializePvEBattle("cave"),
  "/forest": initializePvEBattle("forest"),
  "/mountain": initializePvEBattle("mountain"),
  "/valley": initializePvEBattle("valley"),
  "/google": initializePvEBattle("google"),
};
