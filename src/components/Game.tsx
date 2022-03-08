import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  usePixiApp,
  useRoom,
  generateRoomShell,
  createHero,
  useSpritesheet,
} from "../common";

export function Game() {
  const gameWrapper = useRef<Nullable<HTMLDivElement>>(null);
  const { screen } = usePixiApp(gameWrapper.current);
  const _layout = useMemo(() => generateRoomShell(4, 4), []);
  const adjustEachSprite = useCallback((sprite: PIXI.Sprite) => {
    sprite.name = sprite.texture.textureCacheIds[0];
  }, []);
  const room = useRoom("bar", _layout, adjustEachSprite);
  const handleSheetLoad = useCallback(
    (sheet: PIXI.Spritesheet) => {
      if (room) {
        const hero = createHero(sheet, "axe");
        room.addChild(hero.container);
        hero.methods.register(room);
        hero.methods.moveTo(room.width / 2, room.height / 2);

        return () => {
          hero.methods.unregister(room);
        };
      }
    },
    [room]
  );
  useSpritesheet(handleSheetLoad);
  const done = useRef(false);

  useEffect(() => {
    if (!done.current && screen && room) {
      screen.addChild(room);
      const _screen = screen as any;

      room.position.set(
        _screen._width / 2 - room.width / 2,
        _screen._height / 2 - room.height / 2
      );

      const foo = gsap.utils.interpolate({ x: 1, y: 1 }, { x: 2, y: 2 }, 0.5);
      console.log({ foo });

      done.current = true;
    }
  });

  return <div ref={gameWrapper} />;
}
