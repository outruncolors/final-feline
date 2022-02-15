import * as PIXI from "pixi.js";
import { basicTextStyle } from "./text";

export const bootstrap = (app: PIXI.Application) => {
  const text = new PIXI.Text("Hello world.", basicTextStyle);
  app.stage.addChild(text);
  app.renderer.render(app.stage);
};
