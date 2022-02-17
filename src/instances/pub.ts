import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";
import { NavigateFunction } from "react-router-dom";
import { getLocationSprite } from "../common";

const loader = PIXI.Loader.shared;

export const initializePub = (
  app: PIXI.Application,
  screen: PIXI.Container,
  navigator: NavigateFunction
) => {
  addImage(app, screen);
  playBackgroundMusic();
  loadMercenaries(app, screen);
};

const addImage = (app: PIXI.Application, screen: PIXI.Container) => {
  const sprite = getLocationSprite("pub");
  sprite.scale.set(1.33, 1);
  screen.addChild(sprite);
};

const playBackgroundMusic = async () => {
  sound.add("pub", "/assets/sounds/pub.mp3");
  sound.play("pub", {
    volume: 0.5,
    loop: true,
  });
};

const loadMercenaries = async (
  app: PIXI.Application,
  screen: PIXI.Container
) => {
  const dramanautAnimations = await loadJobAnimations("copamancer");
  const { walking, attacking, defending, dying } = dramanautAnimations;

  let i = 0;
  for (const animation of [walking, attacking, defending, dying]) {
    animation.play();
    animation.scale.set(8);
    animation.anchor.set(0.5);
    animation.position.set(500 + 256 * i, app.view.height * 0.66);

    screen.addChild(animation);

    i++;
  }

  defending.anchor.x = 1;
  defending.scale.x *= -1;

  dying.anchor.x = 1;
  dying.scale.x *= -1;
};

export const loadJobAnimations = (
  job: string
): Promise<{
  job: string;
  walking: PIXI.AnimatedSprite;
  attacking: PIXI.AnimatedSprite;
  defending: PIXI.AnimatedSprite;
  dying: PIXI.AnimatedSprite;
}> =>
  new Promise((resolve) =>
    loader
      .add(`/assets/images/${job}.json`, { crossOrigin: "anonymous" })
      .load(() => {
        const sheet =
          PIXI.Loader.shared.resources[`/assets/images/${job}.json`]
            .spritesheet;

        if (sheet) {
          const { stand, walk, attack, defend, down } = sheet.textures;
          const walking = new PIXI.AnimatedSprite([stand, walk]);
          const attacking = new PIXI.AnimatedSprite([stand, attack]);
          const defending = new PIXI.AnimatedSprite([stand, defend]);
          const dying = new PIXI.AnimatedSprite([stand, down]);

          for (const animation of [walking, attacking, defending, dying]) {
            animation.scale.set(5);
            animation.animationSpeed = 0.05;
          }

          resolve({
            job,
            walking,
            attacking,
            defending,
            dying,
          });
        }
      })
  );
