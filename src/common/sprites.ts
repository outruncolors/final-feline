import * as PIXI from "pixi.js";
import { AllSkills, AllEffects } from "../data";

export const getLocationSprite = (locationName: string) => {
  const sheet =
    PIXI.Loader.shared.resources[`/assets/sprites.json`].spritesheet;

  if (sheet) {
    const texture = sheet.textures[`locations/${locationName}`];
    const sprite = new PIXI.Sprite(texture);
    sprite.scale.set(4, 3);
    return sprite;
  }
};

export const loadEntityAnimations = (job: EntityName) => {
  const sheet =
    PIXI.Loader.shared.resources[`/assets/sprites.json`].spritesheet;

  if (sheet) {
    const container = new PIXI.Container();
    const prefix = `jobs/${job}/${job}`;
    const standing = new PIXI.AnimatedSprite(
      sheet.animations[`${prefix}_stand`]
    );
    const walking = new PIXI.AnimatedSprite(sheet.animations[`${prefix}_walk`]);
    const attacking = new PIXI.AnimatedSprite(
      sheet.animations[`${prefix}_attack`]
    );
    const defending = new PIXI.AnimatedSprite(
      sheet.animations[`${prefix}_defend`]
    );
    const dying = new PIXI.AnimatedSprite(sheet.animations[`${prefix}_down`]);

    for (const animation of [standing, walking, attacking, defending, dying]) {
      animation.scale.set(5);
      animation.animationSpeed = 0.05;
      animation.visible = false;
      container.addChild(animation);
    }

    standing.visible = true;

    return {
      container,
      standing,
      walking,
      attacking,
      defending,
      dying,
    };
  } else {
    throw new Error();
  }
};

export const loadSkillAnimation = (skillName: keyof AllSkills) => {
  const sheet =
    PIXI.Loader.shared.resources[`/assets/sprites.json`].spritesheet;

  if (sheet) {
    const key = `skills/${skillName}/skill_${skillName}`;
    return sheet.animations[key];
  } else {
    throw new Error();
  }
};

export const loadEffectAnimation = (effectName: keyof AllEffects) => {
  const sheet =
    PIXI.Loader.shared.resources[`/assets/sprites.json`].spritesheet;

  console.log(sheet);

  if (sheet) {
    const key = `effects/${effectName}/effect_${effectName}`;
    return sheet.animations[key];
  } else {
    throw new Error();
  }
};
