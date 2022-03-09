import * as PIXI from "pixi.js";
import { registerCharacterMovement } from "./movement";

type HeroWeapon = "sword" | "axe" | "hammer";
export type Hero = ReturnType<typeof createHero>;

export const createHero = (sheet: PIXI.Spritesheet, weapon: HeroWeapon) => {
  const container = new PIXI.Container();
  container.scale.set(2);
  container.pivot.set(0.5);
  const idleSprite = new PIXI.AnimatedSprite(
    sheet.animations[`hero/idle/${weapon}`]
  );
  idleSprite.animationSpeed = 0.05;
  idleSprite.play();

  const walkSprite = new PIXI.AnimatedSprite(
    sheet.animations[`hero/walk/${weapon}`]
  );
  walkSprite.animationSpeed = 0.2;
  walkSprite.play();
  walkSprite.visible = false;

  container.addChild(idleSprite, walkSprite);

  const stand = () => {
    if (!idleSprite.visible) {
      idleSprite.visible = true;
      idleSprite.gotoAndPlay(0);

      walkSprite.visible = false;
      walkSprite.gotoAndStop(0);
    }
  };
  const walk = () => {
    if (!walkSprite.visible) {
      idleSprite.visible = false;
      idleSprite.gotoAndStop(0);

      walkSprite.visible = true;
      walkSprite.gotoAndPlay(0);
    }
  };
  const moveTo = (x: number, y: number) => container.position.set(x, y);

  let unregister: ReturnType<typeof registerCharacterMovement>;
  const hero = {
    container,
    animations: {
      all: [idleSprite, walkSprite],
      each: {
        idleSprite,
        walkSprite,
      },
    },
    methods: {
      stand,
      walk,
      moveTo,
      flip: () => {
        for (const sprite of hero.animations.all) {
          const prevX = sprite.anchor.x;
          sprite.anchor.x = prevX === 0 ? 1 : 0;
          sprite.scale.x *= -1;
        }
      },
      register: (room: PIXI.Container) => {
        unregister = registerCharacterMovement(hero, room);
      },
      unregister: (room: PIXI.Container) => {
        unregister?.();
      },
    },
  };

  return hero;
};
