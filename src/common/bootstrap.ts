import * as PIXI from "pixi.js";
import { NavigateFunction } from "react-router-dom";

export const bootstrap = (
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

  instance(app, screen, navigator);
};
