import * as PIXI from "pixi.js";
import { NavigateFunction } from "react-router-dom";

const loader = PIXI.Loader.shared;

export const bootstrap = async (
  app: PIXI.Application,
  instance: (
    app: PIXI.Application,
    screen: PIXI.Container,
    navigator: NavigateFunction
  ) => void,
  navigator: NavigateFunction
) => {
  const screen = new PIXI.Container();
  app.stage.addChild(screen);
  app.renderer.render(app.stage);

  try {
    await loadCommonAssets();
  } catch (error) {}

  instance(app, screen, navigator);
};

const loadCommonAssets = () => {
  return new Promise((resolve) => {
    loader
      .add("/assets/sprites.json", { crossOrigin: "anonymous" })
      .load(resolve);
  });
};
