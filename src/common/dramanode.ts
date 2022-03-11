import * as PIXI from "pixi.js";

export const createDramanode = (sheet: PIXI.Spritesheet) => {
  const container = new PIXI.Container();
  container.pivot.set(0.5);
  const pulseSprite = new PIXI.AnimatedSprite(
    sheet.animations[`etc/dramanode/pulse`]
  );

  container.addChild(pulseSprite);
  pulseSprite.animationSpeed = 0.2;
  pulseSprite.play();

  const explodeSprite = new PIXI.AnimatedSprite(
    sheet.animations[`etc/dramanode/explode`]
  );
  container.addChild(explodeSprite);
  explodeSprite.animationSpeed = 0.5;
  explodeSprite.loop = false;
  explodeSprite.visible = false;
  explodeSprite.onComplete = () => {
    container.visible = false;
  };
  const moveTo = (x: number, y: number) => container.position.set(x, y);

  const dramanode = {
    container,
    animations: {
      all: [],
      each: {},
    },
    methods: {
      moveTo,
      unregister: () => {},
      explode: () => {
        if (!explodeSprite.visible) {
          explodeSprite.visible = true;
          pulseSprite.visible = false;
          explodeSprite.play();
        }
      },
    },
  };

  return dramanode;
};
