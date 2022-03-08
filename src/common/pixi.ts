import * as PIXI from "pixi.js";
import { useEffect, useRef, useState } from "react";

export const pixiNames = {
  MAIN_SCREEN: "Main Screen",
  HITBOX: "Hitbox",
  WALL: "wall",
  WALL_TOP: "wall-top",
  WALL_CORNER: "wall-corner",
  WALL_TOP_CORNER: "wall-top-corner",
  FLOOR: "floor",
};

export const usePixiApp = (wrapper: Nullable<HTMLElement>) => {
  const [app, setApp] = useState<Nullable<PIXI.Application>>(null);
  const [screen, setScreen] = useState<Nullable<PIXI.Container>>(null);
  const loaded = useRef(false);
  const assetsLoaded = useRef(false);

  // eslint-disable-next-line
  useEffect(() => {
    if (wrapper && !loaded.current) {
      const _app = new PIXI.Application({
        width: document.body.clientWidth,
        height: document.body.clientHeight,
        resizeTo: window,
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
    }
  });

  return {
    app,
    screen,
    isLoaded: () => loaded.current,
    assetsAreLoaded: () => assetsLoaded.current,
  };
};

let alreadyLoaded = false;
export const useSpritesheet = () => {
  const [spritesheet, setSpritesheet] =
    useState<Nullable<PIXI.Spritesheet>>(null);

  useEffect(() => {
    if (!spritesheet) {
      if (alreadyLoaded) {
        setSpritesheet(
          PIXI.Loader.shared.resources["/assets/textures/sprites.json"]
            .spritesheet!
        );
      } else {
        if (!PIXI.Loader.shared.loading) {
          new Promise((resolve) => {
            PIXI.Loader.shared
              .add(`/assets/textures/sprites.json`, {
                crossOrigin: "anonymous",
              })
              .load(resolve);
          }).then(() => {
            const sheet =
              PIXI.Loader.shared.resources["/assets/textures/sprites.json"]
                .spritesheet!;
            setSpritesheet(sheet);
            alreadyLoaded = true;
          });
        }
      }
    }
  }, [spritesheet]);

  return spritesheet;
};
