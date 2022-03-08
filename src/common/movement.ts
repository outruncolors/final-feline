import * as PIXI from "pixi.js";
import { useEffect } from "react";
import { contain } from "./contain";
import { keyboard } from "./keyboard";
import { pixiNames } from "./pixi";
import type { Hero } from "./hero";

const CHARACTER_MOVEMENT_SPEED = 3;

export const registerCharacterMovement = (hero: Hero) => {
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
  const move = () => {
    const { vx, vy } = tracked;

    container.position.x += vx;
    container.position.y += vy;

    if (vx < 0 && !flipped) {
      hero.methods.flip();
      flipped = true;
    } else if (vx > 0 && flipped) {
      hero.methods.flip();
      flipped = false;
    }

    if (vx === 0 && vy === 0) {
      hero.methods.stand();
    } else {
      hero.methods.walk();
    }
  };

  PIXI.Ticker.shared.add(move);

  return () => {
    directions.forEach((handler) => handler.unsubscribe());
    PIXI.Ticker.shared.remove(move);
  };
};

export const useCharacterMovement = (
  bootstrapped: boolean,
  screen: Nullable<PIXI.Container>
) => {
  useEffect(() => {
    if (bootstrapped && screen) {
      const heroWalkSheet =
        PIXI.Loader.shared.resources["/assets/textures/hero-walk.json"]
          .spritesheet;

      if (heroWalkSheet) {
        const heroWalkAnimation = new PIXI.AnimatedSprite(
          heroWalkSheet.animations["walk.xml."]
        );
        screen.addChild(heroWalkAnimation);
        heroWalkAnimation.scale.set(0.6);
        heroWalkAnimation.anchor.set(0.5);
        heroWalkAnimation.animationSpeed = 0.8;

        //
        const hitbox = PIXI.Sprite.from(PIXI.Texture.WHITE);
        hitbox.name = pixiNames.HITBOX;
        hitbox.width = 200 * 0.6;
        hitbox.height = 200 * 0.6;
        hitbox.visible = false;
        hitbox.anchor.set(0.5);
        hitbox.position.set(40 * 0.6, 100 * 0.6);
        heroWalkAnimation.addChild(hitbox);
        heroWalkAnimation.hitArea = {
          contains: (x, y) => {
            return hitbox.containsPoint({ x, y });
          },
        };

        //
        const up = keyboard("w"),
          right = keyboard("d"),
          down = keyboard("s"),
          left = keyboard("a");
        const directionKeys = [up, right, down, left];

        let walking: "left" | "none" | "right" = "none";
        let velocity = {
          x: 0,
          y: 0,
        };
        let flipped = false;

        up.press = () => {
          if (!down.isDown) {
            if (walking === "none") {
              walking = "right";
            }
            velocity.y = -8;
          }
        };
        right.press = () => {
          walking = "right";
          velocity.x = 8;
        };
        down.press = () => {
          if (walking === "none") {
            walking = "right";
          }

          velocity.y = 8;
        };
        left.press = () => {
          walking = "left";
          velocity.x = -8;
        };

        const handleWalking = () => {
          if (directionKeys.some((key) => key.isDown)) {
            heroWalkAnimation.play();

            if (
              (walking === "left" && !flipped) ||
              (walking !== "left" && flipped)
            ) {
              heroWalkAnimation.scale.x *= -1;
              flipped = !flipped;
            }
          } else {
            heroWalkAnimation.gotoAndStop(0);
            velocity = {
              x: 0,
              y: 0,
            };
          }

          heroWalkAnimation.position.x += velocity.x;
          heroWalkAnimation.position.y += velocity.y;

          contain(heroWalkAnimation, screen);
        };

        PIXI.Ticker.shared.add(handleWalking);

        return () => {
          screen.removeChild(heroWalkAnimation);
          directionKeys.forEach((key) => key.unsubscribe());
          PIXI.Ticker.shared.remove(handleWalking);
        };
      }
    }
  }, [bootstrapped, screen]);
};
