import * as PIXI from "pixi.js";
import { Resource } from "pixi.js";
import { config } from ".";
import { AfflictionKind, SkillKind, LocationKind, EntityKind } from "../data";

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

export interface EntityAnimations {
  container: PIXI.Container;
  standing: PIXI.AnimatedSprite;
  walking: PIXI.AnimatedSprite;
  attacking: PIXI.AnimatedSprite;
  defending: PIXI.AnimatedSprite;
  dying: PIXI.AnimatedSprite;
}

export type EntityAnimationLoader = (key: EntityKind) => EntityAnimations;

export const loadAnimation = (animation: string) =>
  loadVisualAsset(animation, true) as PIXI.AnimatedSprite;

/* = = C O M P O S I T I O N S = = */
export const loadLocationSprite = (location: LocationKind) => {
  const sprite = loadSprite(`locations/${location}`);
  sprite.scale.set(4, 3);
  return sprite;
};

export const loadExtraSprite = (extra: string) =>
  loadSprite(`extras/extra_${extra}`);

export const loadExtraAnimation = (extra: string) =>
  loadAnimation(`extras/${extra}/extra_${extra}`);

export const loadAfflictionAnimation = (affliction: AfflictionKind) =>
  loadAnimation(
    `afflictions/${affliction}/affliction_${affliction}`
  ) as PIXI.AnimatedSprite;

export const loadSkillAnimation = (skill: SkillKind) =>
  loadAnimation(`skills/${skill}/skill_${skill}`);

export const loadCastingAnimations = () => {
  const [behind, front, under] = ["behind", "front", "under"].map((place) =>
    loadAnimation(`extras/casting-${place}/extra_casting-${place}`)
  );

  for (const animation of [behind, front, under]) {
    animation.animationSpeed = config.FASTER_ANIMATION_SPEED;
    animation.scale.set(config.ENTITY_SCALE);
  }

  return {
    behind,
    front,
    under,
  };
};

// === Entities ===

export const loadJobAnimations = (job: EntityKind): EntityAnimations => {
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
    animation.scale.set(config.ENTITY_SCALE);
    animation.animationSpeed = config.SLOWED_ANIMATION_SPEED;
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

export const loadFoeAnimations = (foe: EntityKind): EntityAnimations => {
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
    animation.scale.set(config.ENTITY_SCALE);
    animation.animationSpeed = config.SLOWED_ANIMATION_SPEED;
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
