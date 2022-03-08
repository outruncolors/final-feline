import * as PIXI from "pixi.js";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  usePixiApp,
  useRoom,
  generateRoomShell,
  createSpelkirv,
} from "../common";

export function Game() {
  const gameWrapper = useRef<Nullable<HTMLDivElement>>(null);
  const { screen } = usePixiApp(gameWrapper.current);
  const _layout = useMemo(() => generateRoomShell(6, 2), []);
  const adjustEachSprite = useCallback((sprite: PIXI.Sprite) => {}, []);
  const room = useRoom("bar", _layout, adjustEachSprite);

  useEffect(() => {
    if (screen && room) {
      screen.addChild(room);
      const _screen = screen as any;

      room.position.set(
        _screen._width / 2 - room.width / 2,
        _screen._height / 2 - room.height / 2
      );

      createSpelkirv(screen, 2);
    }
  }, [screen, room]);

  return <div ref={gameWrapper} />;
}
