import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";
import Chance from "chance";
import { NavigateFunction } from "react-router-dom";
import { config, getLocationSprite } from "../common";
import { Entity } from "../classes";

const CHANCE = new Chance();

export const initializePub = (
  app: PIXI.Application,
  screen: PIXI.Container,
  navigator: NavigateFunction
) => {
  addImage(app, screen);
  playBackgroundMusic();
  populatePub(app, screen);
};

const addImage = (app: PIXI.Application, screen: PIXI.Container) => {
  const sprite = getLocationSprite("pub");
  sprite.scale.set(1.33, 1);
  screen.addChild(sprite);
};

const playBackgroundMusic = async () => {
  sound.add("pub", "/assets/sounds/pub.mp3");
  sound.play("pub", {
    volume: 0.5,
    loop: true,
  });
};

const populatePub = async (app: PIXI.Application, screen: PIXI.Container) => {
  const populationCount = CHANCE.integer({
    min: config.PUB_POPULATION_MINIMUM,
    max: config.PUB_POPULATION_MAXIMUM,
  });
  const populationWrapper = new PIXI.Container();
  const entities: Entity[] = [];

  const possibleEntities = [
    "dramanaut",
    "copamancer",
    "dilationist",
    "maldician",
    "seethesayer",
  ] as EntityName[];
  for (let i = 0; i < populationCount; i++) {
    const entity = new Entity(CHANCE.pickone(possibleEntities));
    entities.push(entity);
    await entity.load();

    const container = entity.container!;
    container.position.x = CHANCE.integer({
      min: 0,
      max: app.view.width * 0.9,
    });
    populationWrapper.addChild(container);
  }

  populationWrapper.position.y = app.view.height - populationWrapper.height;

  screen.addChild(populationWrapper);
};
