import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";
import { NavigateFunction } from "react-router-dom";
import { getLocationSprite } from "../common";

export const initializePvEBattle =
  (location: string) =>
  (
    app: PIXI.Application,
    screen: PIXI.Container,
    navigator: NavigateFunction
  ) => {
    addImage(location, app, screen);
    playBackgroundMusic();
  };

const addImage = (
  location: string,
  app: PIXI.Application,
  screen: PIXI.Container
) => {
  const sprite = getLocationSprite(location);
  sprite.scale.set(1.33, 1);
  screen.addChild(sprite);
};

const playBackgroundMusic = async () => {
  sound.add("battle", "/assets/sounds/battle.wav");
  sound.play("battle", {
    volume: 0.66,
    loop: true,
  });
};
