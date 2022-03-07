import * as PIXI from "pixi.js";
import { pixiNames } from ".";

export const contain = (
  sprite: PIXI.Sprite | PIXI.AnimatedSprite,
  container: PIXI.Container
) => {
  let collision: undefined | "left" | "top" | "right" | "bottom" = undefined;
  const _container = container as any;
  const hitbox = sprite.getChildByName(pixiNames.HITBOX) as PIXI.AnimatedSprite;

  if (!hitbox) {
    throw new Error();
  }

  //Left
  if (hitbox.getGlobalPosition().x - hitbox.width / 2 < container.x) {
    sprite.x = container.x + hitbox.width / 2;
    collision = "left";
  }

  //Top
  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision = "top";
  }

  //Right
  if (hitbox.getGlobalPosition().x + hitbox.width / 2 > _container._width) {
    sprite.x = _container._width - hitbox.width / 2;
    collision = "right";
  }

  //Bottom
  if (hitbox.getGlobalPosition().y + hitbox.height / 2 > _container._height) {
    sprite.y = _container._height - hitbox.height;
    collision = "bottom";
  }

  //Return the `collision` value
  return collision;
};
