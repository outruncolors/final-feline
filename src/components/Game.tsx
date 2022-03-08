import { useCallback, useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { usePixiApp, useRoomBuilder } from "../common";

export function Game() {
  const gameWrapper = useRef<Nullable<HTMLDivElement>>(null);
  const { screen } = usePixiApp(gameWrapper.current);
  const { room } = useRoomBuilder();

  useEffect(() => {
    if (screen && room) {
      room.position.set(200, 200);
      screen.addChild(room);
    }
  }, [screen, room]);

  return <div ref={gameWrapper}>Game</div>;
}
