import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";
import { NavigateFunction } from "react-router-dom";
import {
  basicTextStyle,
  config,
  getLocationSprite,
  makeHighlightable,
  padding,
  titleTextStyle,
} from "../common";
import { locations } from "../data";

export const initializeWorldMap = (
  app: PIXI.Application,
  screen: PIXI.Container,
  navigator: NavigateFunction
) => {
  addTitle(app, screen);
  addOptions(app, screen, navigator);
  addImage(app, screen);
  playBackgroundMusic();
};

const addTitle = (app: PIXI.Application, screen: PIXI.Container) => {
  const title = new PIXI.Text(config.GAME_TITLE, titleTextStyle);
  title.anchor.set(0.5);
  title.position.set(app.view.width / 2, padding.large * 2);
  screen.addChild(title);
};

const addOptions = (
  app: PIXI.Application,
  screen: PIXI.Container,
  navigator: NavigateFunction
) => {
  const optionWrapper = new PIXI.Container();
  const options = locations
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter(({ name }) => name !== "world-map");

  let optionIndex = 0;
  for (const option of options) {
    const optionText = new PIXI.Text(option.name.toUpperCase(), basicTextStyle);
    optionText.anchor.set(1);
    optionText.position.set(
      0,
      optionIndex * optionText.height + padding.medium
    );

    if (typeof option.accessible === "undefined" || option.accessible) {
      makeHighlightable(optionText);
      const handleInteraction = () =>
        handleSelectOption(option, screen, navigator);
      optionText.on("mousedown", handleInteraction);
      optionText.on("touchstart", handleInteraction);
    } else {
      optionText.alpha = 0.3;
    }

    optionWrapper.addChild(optionText);
    optionIndex++;
  }

  optionWrapper.position.set(
    app.view.width / 2 - optionWrapper.width,
    padding.large * 4
  );
  screen.addChild(optionWrapper);
};

const handleSelectOption = (
  option: WorldLocation,
  screen: PIXI.Container,
  navigator: NavigateFunction
) => {
  screen.removeChildren();
  sound.stop("world-map");
  navigator(`/${option.name}`);
};

const addImage = (app: PIXI.Application, screen: PIXI.Container) => {
  const sprite = getLocationSprite("world-map");
  sprite.scale.set(0.5);
  sprite.position.set(
    app.view.width / 2 - padding.large * 2,
    padding.large * 4
  );
  screen.addChild(sprite);
};

const playBackgroundMusic = async () => {
  sound.add("world-map", "/assets/sounds/world-map.mp3");
  sound.play("world-map", {
    volume: 0.5,
    loop: true,
  });
};
