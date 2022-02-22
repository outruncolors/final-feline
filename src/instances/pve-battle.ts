import * as PIXI from "pixi.js";
import { NavigateFunction } from "react-router-dom";
import { RandomBattle } from "../classes";
import { LocationKind } from "../data";

export const initializePvEBattle =
  (location = "" as "" | LocationKind) =>
  (
    app: PIXI.Application,
    screen: PIXI.Container,
    navigator: NavigateFunction
  ) => {
    startBattle(app, screen, location);
  };

const startBattle = async (
  app: PIXI.Application,
  screen: PIXI.Container,
  location: "" | LocationKind
) => {
  const battle = new RandomBattle(screen);
  await battle.load();
};
