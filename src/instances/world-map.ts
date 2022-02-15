import * as PIXI from "pixi.js";
import {
  basicTextStyle,
  titleTextStyle,
  padding,
  makeHighlightable,
  config,
} from "../common";
import { locations } from "../data";

const refs: Record<string, PIXI.Container> = {};

export const initializeWorldMap = (
  app: PIXI.Application,
  screen: PIXI.Container
) => {
  addTitle(app, screen);
  addOptions(app, screen);
};

const addTitle = (app: PIXI.Application, screen: PIXI.Container) => {
  const title = new PIXI.Text(config.GAME_TITLE, titleTextStyle);
  title.anchor.set(0.5);
  title.position.set(app.view.width / 2, padding.large * 2);
  refs.title = title;
  screen.addChild(title);
};

const addOptions = (app: PIXI.Application, screen: PIXI.Container) => {
  const optionWrapper = new PIXI.Container();
  const options = locations.sort((a, b) => a.name.localeCompare(b.name));

  let optionIndex = 0;
  for (const option of options) {
    const optionText = new PIXI.Text(option.name.toUpperCase(), basicTextStyle);
    optionText.position.set(
      padding.small,
      optionIndex * optionText.height + padding.small
    );

    if (typeof option.accessible === "undefined" || option.accessible) {
      makeHighlightable(optionText);
      const handleInteraction = () => handleSelectOption(option, screen);
      optionText.on("mousedown", handleInteraction);
      optionText.on("touchstart", handleInteraction);
    } else {
      optionText.alpha = 0.3;
    }

    optionWrapper.addChild(optionText);
    optionIndex++;
  }

  optionWrapper.position.set(
    app.view.width / 2 - optionWrapper.width / 2,
    padding.large * 4
  );
  refs.optionWrapper = optionWrapper;
  screen.addChild(optionWrapper);
};

const handleSelectOption = (option: WorldLocation, screen: PIXI.Container) => {
  screen.removeChildren();
};
