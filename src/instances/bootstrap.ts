import * as PIXI from "pixi.js";
import { initializeWorldMap } from "./world-map";

export const bootstrap = (app: PIXI.Application) => {
  const screen = new PIXI.Container();
  app.stage.addChild(screen);
  app.renderer.render(app.stage);

  initializeWorldMap(app, screen);
};
