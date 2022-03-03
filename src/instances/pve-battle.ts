import * as PIXI from "pixi.js";
import { NavigateFunction } from "react-router-dom";
import { RandomBattle } from "../classes";

export const initializePvEBattle =
  () =>
  (
    app: PIXI.Application,
    screen: PIXI.Container,
    navigator: NavigateFunction
  ) => {
    startBattle(app, screen);
  };

const startBattle = async (app: PIXI.Application, screen: PIXI.Container) => {
  const battle = new RandomBattle(screen);
  await battle.load();
};
