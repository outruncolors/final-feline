import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";
import { NavigateFunction } from "react-router-dom";
import { loadLocation, loadFoeAnimations } from "../common";
import { Battle, Entity, FoeEntity } from "../classes";

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
    startBattle(app, screen);
  };

const addImage = (
  location: string,
  app: PIXI.Application,
  screen: PIXI.Container
) => {
  const sprite = loadLocation(location);

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
  // const entityA = new Entity("maldician", screen);
  // const entityB = new Entity("seethesayer", screen);
  // const battleContainer = new PIXI.Container();
  // await entityA.load();
  // await entityB.load();
  // const leftContainer = new PIXI.Container();
  // leftContainer.addChild(entityA.container!);
  // const rightContainer = new PIXI.Container();
  // rightContainer.addChild(entityB.container!);
  // rightContainer.position.x = app.view.width - rightContainer.width;
  // battleContainer.addChild(leftContainer);
  // battleContainer.addChild(rightContainer);
  // screen.addChild(battleContainer);
  // entityA.cast("subscribe", entityA);
};

const startBattle = async (app: PIXI.Application, screen: PIXI.Container) => {
  const battle = new Battle();

  // const derp = loadFoeAnimations("lolcow");
  // screen.addChild(derp.container);

  const foo = new FoeEntity("lolcow", screen);
  await foo.load();

  if (foo.loaded) {
    screen.addChild(foo.container!);
  }

  foo.container!.y += 300;
  foo.cast("report", foo);
};
