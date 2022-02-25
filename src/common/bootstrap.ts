import * as PIXI from "pixi.js";
import WebFont from "webfontloader";
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

    WebFont.load({
      custom: {
        families: ["VCR OSD Mono 1"],
        urls: ["/assets/fonts/fonts.css"],
      },
      active: () => instance(app, screen, navigator),
    });
  } catch (error) {}
};

const loadCommonAssets = () => {
  return new Promise((resolve) => {
    loader
      .add("/assets/sprites.json", { crossOrigin: "anonymous" })
      .load(resolve);
  });
};
