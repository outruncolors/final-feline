import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";
import { NavigateFunction } from "react-router-dom";
import { getLocationSprite } from "../common";
import { Entity } from "../classes";

export const initializePvEBattle =
  (location: string) =>
  (
    app: PIXI.Application,
    screen: PIXI.Container,
    navigator: NavigateFunction
  ) => {
    addImage(location, app, screen);
    playBackgroundMusic();
    populateTeams(app, screen);
  };

const addImage = (
  location: string,
  app: PIXI.Application,
  screen: PIXI.Container
) => {
  const sprite = getLocationSprite(location);

  if (sprite) {
    screen.addChild(sprite);
  }
};

const playBackgroundMusic = async () => {
  sound.add("battle", "/assets/sounds/battle.wav");
  sound.play("battle", {
    volume: 0.66,
    loop: true,
  });
};

const populateTeams = async (app: PIXI.Application, screen: PIXI.Container) => {
  const entityA = new Entity("maldician");
  const entityB = new Entity("seethesayer");
  const battleContainer = new PIXI.Container();

  await entityA.load();
  await entityB.load();

  const leftContainer = new PIXI.Container();
  leftContainer.addChild(entityA.container!);

  const rightContainer = new PIXI.Container();
  rightContainer.addChild(entityB.container!);
  rightContainer.position.x = app.view.width - rightContainer.width;

  battleContainer.addChild(leftContainer);
  battleContainer.addChild(rightContainer);

  screen.addChild(battleContainer);

  entityA.cast("flame", entityB);
};
