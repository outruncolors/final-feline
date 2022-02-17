import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";
import { NavigateFunction } from "react-router-dom";
import { getLocationSprite } from "../common";
import { Entity } from "../classes";

export const initializePub = (
  app: PIXI.Application,
  screen: PIXI.Container,
  navigator: NavigateFunction
) => {
  addImage(app, screen);
  playBackgroundMusic();
  loadMercenary("copamancer", app, screen);
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

const loadMercenary = async (
  mercenary: EntityName,
  app: PIXI.Application,
  screen: PIXI.Container
) => {
  const entity = new Entity(mercenary);

  await entity.load();

  const wrapper = entity.container!;
  wrapper.position.set(app.view.width / 2, app.view.height / 2);

  screen.addChild(wrapper);

  (window as any).sprite_actions = {
    damage(amount: number) {
      entity.damageBy(amount);
    },
  };
};
