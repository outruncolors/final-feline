import * as PIXI from "pixi.js";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  usePixiApp,
  useRoom,
  generateRoomShell,
  createHero,
  createDramanode,
  createGlitchGate,
  useSpritesheet,
  Bump,
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
        const gate = createGlitchGate(sheet);
        room.addChild(gate.container);
        gate.methods.moveTo(room.width / 4, room.height / 2);

        const hero = createHero(sheet, "axe");
        room.addChild(hero.container);
        hero.methods.register(room);
        hero.methods.moveTo(room.width / 2, room.height / 2);

        gate.container.interactive = true;
        gate.container.buttonMode = true;
        gate.container.on("pointerdown", gate.methods.toggle);

        const node = createDramanode(sheet);
        room.addChild(node.container);
        node.methods.moveTo(room.width / 2, room.height / 2);

        const checkin = () => {
          if (bump.current) {
            for (const each of [node]) {
              const hit = bump.current.hit(
                hero.container,
                each.container,
                true
              );

              if (hit) {
                // node.methods.explode();
              }
            }
          }
        };

        PIXI.Ticker.shared.add(checkin);

        return () => {
          hero.methods.unregister(room);
          PIXI.Ticker.shared.remove(checkin);
        };
      }
    },
    [room]
  );
  useSpritesheet(handleSheetLoad);
  const done = useRef(false);
  const bump = useRef<Nullable<Bump>>(null);

  useEffect(() => {
    if (!done.current && screen && room) {
      screen.addChild(room);
      const _screen = screen as any;

      room.position.set(
        _screen._width / 2 - room.width / 2,
        _screen._height / 2 - room.height / 2
      );

      bump.current = new Bump(PIXI);
      done.current = true;
    }
  });

  return <div ref={gameWrapper} />;
}
