import * as PIXI from "pixi.js";
import { NavigateFunction } from "react-router-dom";
import { Battle, RandomBattle } from "../classes";
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
  const battle = location
    ? new Battle(location, screen, [])
    : new RandomBattle(screen);

  await battle.load();
};
