import * as PIXI from "pixi.js";
import { Resource } from "pixi.js";
import { AllSkills, AllEffects, AllFoes } from "../data";

export const loadVisualAsset = (which: string, animated = false) => {
  const sheet =
    PIXI.Loader.shared.resources[`/assets/sprites.json`].spritesheet;

  if (sheet) {
    if (animated) {
      return new PIXI.AnimatedSprite(sheet.animations[which]);
    } else {
      return new PIXI.Sprite(sheet.textures[which]);
    }
  } else {
    throw new Error();
  }
};

export const loadSprite = (sprite: string) =>
  loadVisualAsset(sprite) as PIXI.Sprite;

export const loadAnimation = (animation: string) =>
  loadVisualAsset(animation, true) as PIXI.AnimatedSprite;

/* = = C O M P O S I T I O N S = = */

export const loadLocation = (location: string) => {
  const sprite = loadSprite(`locations/${location}`);
  sprite.scale.set(4, 3);
  return sprite;
};

export const loadExtraAnimation = (extra: string) =>
  loadAnimation(`extra/${extra}/extra_${extra}`);

export const loadAfflictionAnimation = (affliction: keyof AllEffects) =>
  loadAnimation(
    `effects/${affliction}/effect_${affliction}`
  ) as PIXI.AnimatedSprite;

export const loadSkillAnimation = (skill: keyof AllSkills) =>
  loadAnimation(`skills/${skill}/skill_${skill}`);

// === Entities ===

export const loadJobAnimations = (job: string): EntityAnimations => {
  const container = new PIXI.Container();
  const withPrefix = (name: string) => `jobs/${job}/${job}_${name}`;
  const [standing, walking, attacking, defending, dying] = [
    "stand",
    "walk",
    "attack",
    "defend",
    "down",
  ].map((name) => loadAnimation(withPrefix(name)));

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
};

export const loadFoeAnimations = (foe: keyof AllFoes): EntityAnimations => {
  const container = new PIXI.Container();
  const activeAnimation = loadAnimation(`foes/${foe}/foes_${foe}`);
  const [idle] = activeAnimation.textures;
  const idleAnimation = new PIXI.AnimatedSprite([idle] as Array<
    PIXI.Texture<Resource>
  >);

  const [standing, walking, attacking, defending, dying] = [
    idleAnimation,
    activeAnimation,
    activeAnimation,
    idleAnimation,
    idleAnimation,
  ];

  for (const animation of [standing, walking, attacking, defending, dying]) {
    animation.scale.set(5);
    animation.animationSpeed = 0.05;
    animation.visible = false;
    container.addChild(animation);
  }

  standing.visible = true;

  return {
    container,
    standing: idleAnimation,
    walking: activeAnimation,
    attacking: activeAnimation,
    defending: idleAnimation,
    dying: idleAnimation,
  };
};
