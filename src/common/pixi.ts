import * as PIXI from "pixi.js";
import { useEffect, useRef, useState } from "react";

export const pixiNames = {
  MAIN_SCREEN: "Main Screen",
  HITBOX: "Hitbox",
};

export const usePixiApp = (
  wrapper: Nullable<HTMLElement>,
  onAssetLoad: () => void
) => {
  const [app, setApp] = useState<Nullable<PIXI.Application>>(null);
  const [screen, setScreen] = useState<Nullable<PIXI.Container>>(null);
  const loaded = useRef(false);
  const assetsLoaded = useRef(false);

  useEffect(() => {
    if (wrapper && !loaded.current) {
      const _app = new PIXI.Application({
        width: document.body.clientWidth,
        height: document.body.clientHeight,
        // resizeTo: window,
      });
      wrapper.appendChild(_app.view);

      const _screen = new PIXI.Container();
      _app.stage.addChild(_screen);
      _screen.name = pixiNames.MAIN_SCREEN;
      _screen.width = wrapper.clientWidth;
      _screen.height = wrapper.clientHeight;

      _app.renderer.render(_app.stage);

      loaded.current = true;
      setApp(_app);
      setScreen(_screen);

      new Promise((resolve) => {
        PIXI.Loader.shared
          .add("/assets/textures/hero-walk.json", { crossOrigin: "anonymous" })
          .load(resolve);
      }).then(() => {
        assetsLoaded.current = true;
        onAssetLoad();
      });
    }
  });

  return {
    app,
    screen,
    isLoaded: () => loaded.current,
    assetsAreLoaded: () => assetsLoaded.current,
  };
};
