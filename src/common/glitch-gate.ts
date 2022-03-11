import * as PIXI from "pixi.js";

export const createGlitchGate = (sheet: PIXI.Spritesheet) => {
  const container = new PIXI.Container();
  container.pivot.set(0.5, 1);

  const anims: PIXI.AnimatedSprite[] = [];
  for (const anim of ["open", "close"]) {
    const sprite = new PIXI.AnimatedSprite(
      sheet.animations[`etc/glitch-gate/${anim}`]
    );
    anims.push(sprite);

    container.addChild(sprite);
    sprite.scale.set(1.33);
    sprite.animationSpeed = 0.2;
    sprite.loop = false;
    sprite.gotoAndStop(0);
  }

  const moveTo = (x: number, y: number) => container.position.set(x, y);

  const glitchGate = {
    container,
    animations: {
      all: [],
      each: {},
    },
    methods: {
      moveTo,
      open: () => {
        const [open, close] = anims;

        open.visible = true;
        open.gotoAndPlay(0);

        close.visible = false;
        close.gotoAndStop(0);
      },
      close: () => {
        const [open, close] = anims;

        close.visible = true;
        close.gotoAndPlay(0);

        open.visible = false;
        open.gotoAndStop(0);
      },
      toggle: () => {
        const [open] = anims;

        if (open.visible) {
          glitchGate.methods.close();
        } else {
          glitchGate.methods.open();
        }
      },
    },
  };

  return glitchGate;
};
