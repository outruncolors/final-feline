import * as PIXI from "pixi.js";
import locationTextures from "../data/locations.json";

const loader = PIXI.Loader.shared;

export const getLocationSprite = (locationName: string) => {
  const entry = locationTextures.frames.find(({ filename }) =>
    filename.startsWith(locationName)
  );

  if (entry) {
    const texture = PIXI.utils.TextureCache["/assets/images/locations.png"];
    const { x, y, w, h } = entry.frame;
    const rectangle = new PIXI.Rectangle(x, y, w, h);

    texture.frame = rectangle;

    const screen = new PIXI.Sprite(texture);

    return screen;
  } else {
    throw new Error(`Unable to find location sprite for ${locationName}`);
  }
};

export const loadEntityAnimations = (job: string): Promise<EntityAnimations> =>
  new Promise((resolve) =>
    loader
      .add(`/assets/images/${job}.json`, { crossOrigin: "anonymous" })
      .load(() => {
        const sheet =
          PIXI.Loader.shared.resources[`/assets/images/${job}.json`]
            .spritesheet;

        if (sheet) {
          const { stand, walk, attack, defend, down } = sheet.textures;
          const container = new PIXI.Container();
          const standing = new PIXI.AnimatedSprite([stand]);
          const walking = new PIXI.AnimatedSprite([stand, walk]);
          const attacking = new PIXI.AnimatedSprite([stand, attack, stand]);
          const defending = new PIXI.AnimatedSprite([stand, defend]);
          const dying = new PIXI.AnimatedSprite([stand, down]);

          for (const animation of [
            standing,
            walking,
            attacking,
            defending,
            dying,
          ]) {
            animation.scale.set(5);
            animation.animationSpeed = 0.05;
            animation.visible = false;
            container.addChild(animation);
          }

          standing.visible = true;

          resolve({
            job,
            container,
            standing,
            walking,
            attacking,
            defending,
            dying,
          });
        }
      })
  );
