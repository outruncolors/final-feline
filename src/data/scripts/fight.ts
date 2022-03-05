import * as PIXI from "pixi.js";
import Chance from "chance";
import type { GameState, GameChangers } from "../../App";
import { foes, FoeKind } from "../foes";
import { loadFoeAnimations } from "../../common";

const CHANCE = new Chance();

export const fightEnterScript = (
  gameState: GameState,
  gameChangers: GameChangers
) => {
  const screen = gameState.getScreen();

  if (screen) {
    const foesToFight = makeFoesToFight();
    const foeContainer = new PIXI.Container();
    screen.addChild(foeContainer);
    foeContainer.name = "Foe Container";

    for (let i = 0; i < foesToFight.length; i++) {
      const foe = foesToFight[i];
      foeContainer.addChild(foe.container);
      foe.container.position.y += i * foe.container.height;
    }

    foeContainer.position.x = screen.width - foeContainer.width;
    foeContainer.scale.x *= -1;
    foeContainer.position.x -= foeContainer.width;
  }
};

export const fightExitScript = (
  gameState: GameState,
  gameChangers: GameChangers
) => {};

const makeFoesToFight = () =>
  Array.from({ length: CHANCE.integer({ min: 1, max: 3 }) }, () =>
    CHANCE.pickone(Object.keys(foes))
  ).map((foeKind) => {
    const foe = foes[foeKind as FoeKind];
    const animations = loadFoeAnimations(foeKind as FoeKind);

    return {
      ...foe,
      animations: animations.animations,
      container: animations.container,
      effects: animations.effects,
    };
  });
