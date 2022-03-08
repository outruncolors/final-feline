import * as PIXI from "pixi.js";
import { useEffect } from "react";
import { contain } from "./contain";
import { keyboard } from "./keyboard";
import { pixiNames } from "./pixi";

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
