import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";
import { NavigateFunction } from "react-router-dom";
import { loadLocation, loadFoeAnimation } from "../common";
import { Battle, Entity } from "../classes";

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
  const entityA = new Entity("maldician", screen);
  const entityB = new Entity("seethesayer", screen);
  const battleContainer = new PIXI.Container();

  await entityA.load();
  await entityB.load();

  const leftContainer = new PIXI.Container();
  leftContainer.addChild(entityA.container!);

  const rightContainer = new PIXI.Container();
  rightContainer.addChild(entityB.container!);
  rightContainer.position.x = app.view.width - rightContainer.width;

  const foeA = loadFoeAnimation("soynake");
  foeA.animationSpeed = 0.05;
  foeA.play();
  foeA.anchor.x = 1;
  foeA.scale.x *= -1;
  rightContainer.addChild(foeA);

  const foeB = loadFoeAnimation("soyvyrn");
  foeB.animationSpeed = 0.05;
  foeB.play();
  foeB.anchor.x = 1;
  foeB.scale.x *= -1;
  foeB.position.y += 300;
  rightContainer.addChild(foeB);

  const foeC = loadFoeAnimation("soylamander");
  foeC.animationSpeed = 0.05;
  foeC.play();
  foeC.anchor.x = 1;
  foeC.scale.x *= -1;
  foeC.position.y += 600;
  rightContainer.addChild(foeC);

  battleContainer.addChild(leftContainer);
  battleContainer.addChild(rightContainer);

  screen.addChild(battleContainer);

  entityA.cast("subscribe", entityA);
};

const startBattle = (app: PIXI.Application, screen: PIXI.Container) => {
  const battle = new Battle();
};
