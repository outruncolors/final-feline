import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";
import Chance from "chance";
import { NavigateFunction } from "react-router-dom";
import { config, getLocationSprite } from "../common";
import { Entity, ScreenMessage } from "../classes";

const CHANCE = new Chance();

export const initializePub = async (
  app: PIXI.Application,
  screen: PIXI.Container,
  navigator: NavigateFunction
) => {
  addImage(app, screen);
  playBackgroundMusic();
  await populatePub(app, screen);
  showMessages(app, screen);
};

const addImage = (app: PIXI.Application, screen: PIXI.Container) => {
  const sprite = getLocationSprite("pub");

  if (sprite) {
    screen.addChild(sprite);
  }
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

    entity.meander();

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

const showMessages = (app: PIXI.Application, screen: PIXI.Container) => {
  const message = new ScreenMessage(screen, "Hello world.");

  screen.addChild(message.container);
};
