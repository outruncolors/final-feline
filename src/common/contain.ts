import * as PIXI from "pixi.js";

export function contain(
  sprite: PIXI.Container,
  container: {
    x: number;
    y: number;
    width: number;
    height: number;
  }
) {
  let collision = undefined;

  //Left
  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision = "left";
  }

  //Top
  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision = "top";
  }

  //Right
  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
    collision = "right";
  }

  //Bottom
  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
    collision = "bottom";
  }

  //Return the `collision` value
  return collision;
}
