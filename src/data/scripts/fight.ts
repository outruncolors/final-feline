import * as PIXI from "pixi.js";
import Chance from "chance";
import type { GameState, GameChangers } from "../../App";
import { foes, FoeKind } from "../foes";
import {
  loadFoeAnimations,
  loadJobAnimations,
  keyboard,
  KeyboardHandler,
} from "../../common";

const CHANCE = new Chance();
const keyboardHandlers: KeyboardHandler[] = [];

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

    const hero = loadJobAnimations("copamancer");
    const partyContainer = new PIXI.Container();
    screen.addChild(partyContainer);
    partyContainer.name = "Party Container";
    partyContainer.addChild(hero.container);

    const [up, left, down, right] = ["w", "a", "s", "d"].map(keyboard);
    keyboardHandlers.push(up, left, down, right);

    up.press = () => {
      console.log("Up.");
    };
    left.press = () => {
      console.log("Left.");
    };
    down.press = () => {
      console.log("Down.");
    };
    right.press = () => {
      hero.animations.standing.visible = false;
      hero.animations.walking.visible = true;
    };
    right.release = () => {
      hero.animations.walking.visible = false;
      hero.animations.standing.visible = true;
    };
  }
};

export const fightExitScript = (
  gameState: GameState,
  gameChangers: GameChangers
) => {
  for (const keyboardHandler of keyboardHandlers) {
    keyboardHandler.unsubscribe();
  }
};

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
