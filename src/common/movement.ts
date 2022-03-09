import * as PIXI from "pixi.js";
import { colors } from "./colors";
import { keyboard } from "./keyboard";
import type { Hero } from "./hero";

const CHARACTER_MOVEMENT_SPEED = 3;

export const registerCharacterMovement = (hero: Hero, room: PIXI.Container) => {
  const { container } = hero;
  const directions = ["w", "a", "s", "d"].map(keyboard);
  const [up, left, down, right] = directions;
  const tracked = {
    vx: 0,
    vy: 0,
  };

  // Horizontal
  left.press = () => {
    tracked.vx -= CHARACTER_MOVEMENT_SPEED;
    tracked.vy = 0;
  };

  left.release = () => {
    if (!right.isDown && tracked.vy === 0) {
      tracked.vx = 0;
    }
  };

  right.press = () => {
    tracked.vx += CHARACTER_MOVEMENT_SPEED;
    tracked.vy = 0;
  };

  right.release = () => {
    if (!left.isDown && tracked.vy === 0) {
      tracked.vx = 0;
    }
  };

  // Vertical
  up.press = () => {
    tracked.vx = 0;
    tracked.vy -= CHARACTER_MOVEMENT_SPEED;
  };

  up.release = () => {
    if (!down.isDown && tracked.vx === 0) {
      tracked.vy = 0;
    }
  };

  down.press = () => {
    tracked.vx = 0;
    tracked.vy += CHARACTER_MOVEMENT_SPEED;
  };

  down.release = () => {
    if (!up.isDown && tracked.vx === 0) {
      tracked.vy = 0;
    }
  };

  // Sprite Direction
  let flipped = false;

  const text = new PIXI.Text("hey", {
    fill: colors.white,
    stroke: colors.black,
    fontSize: 36,
  });
  room.addChild(text);
  // Bind to floor.
  for (const row of room.children) {
    for (const tile of (row as PIXI.Container).children as PIXI.Sprite[]) {
      if (tile.name?.includes("tileset") && !tile.name?.includes("floor")) {
        tile.alpha = 0.1;
      }
    }
  }
  const move = () => {
    const { vx, vy } = tracked;

    container.position.x += vx;
    container.position.y += vy;

    // Flip when moving left.
    if (vx < 0 && !flipped) {
      hero.methods.flip();
      flipped = true;
    } else if (vx > 0 && flipped) {
      hero.methods.flip();
      flipped = false;
    }

    // Switch animation.
    if (vx === 0 && vy === 0) {
      hero.methods.stand();
    } else {
      hero.methods.walk();
    }

    // Bind to floor.
    // contain(hero.container, {
    //   x: 128,
    //   y: 128,
    //   width: 128 * 6,
    //   height: 128 * 6,
    // } as PIXI.Container);
  };

  PIXI.Ticker.shared.add(move);

  return () => {
    directions.forEach((handler) => handler.unsubscribe());
    PIXI.Ticker.shared.remove(move);
  };
};
