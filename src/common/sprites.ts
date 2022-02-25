import * as PIXI from "pixi.js";
import Chance from "chance";
import { Resource } from "pixi.js";
import * as config from "./config";
import { colors } from "./colors";
import { AfflictionKind, SkillKind, LocationKind, EntityKind, ItemKind } from "../data";

const CHANCE = new Chance();

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
  effects: {
    ready: (percent: number, hasFinaleReady: boolean) => number;
    unready: () => void;
  };
  animations: {
    standing: PIXI.AnimatedSprite;
    walking: PIXI.AnimatedSprite;
    attacking: PIXI.AnimatedSprite;
    defending: PIXI.AnimatedSprite;
    dying: PIXI.AnimatedSprite;
  };
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

export const loadExtraSprite = (extra: string) => {
  const sprite = loadSprite(`extras/extra_${extra}`);
  sprite.scale.set(config.ENTITY_SCALE);
  return sprite;
};

export const loadExtraAnimation = (extra: string) => {
  const animation = loadAnimation(`extras/${extra}/extra_${extra}`);
  animation.scale.set(config.ENTITY_SCALE);
  animation.animationSpeed = config.STANDARD_ANIMATION_SPEED;
  return animation;
};

export const loadAfflictionAnimation = (affliction: AfflictionKind) =>
  loadAnimation(`afflictions/${affliction}/affliction_${affliction}`);

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

export const loadItemAnimation = (item: ItemKind) => {
  const animation = loadAnimation(`items/${item}/item_${item}`);
  animation.scale.set(config.ITEM_SCALE);
  animation.animationSpeed = config.STANDARD_ANIMATION_SPEED;

  return animation;
}

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
  const readyStates = ["stand", "walk", "attack", "defend", "down"].map(
    (name) => loadAnimation(withPrefix(name))
  );

  let i = 0;
  for (const animation of [standing, walking, attacking, defending, dying]) {
    animation.scale.set(config.ENTITY_SCALE);
    animation.animationSpeed = config.SLOWED_ANIMATION_SPEED;
    animation.visible = false;
    container.addChild(animation);

    const readyState = readyStates[i];
    readyState.alpha = 0;
    readyState.tint = colors.black;
    readyState.blendMode = PIXI.BLEND_MODES.ERASE;
    readyState.visible = false;
    animation.addChild(readyState);

    i++;
  }

  standing.visible = true;

  return {
    container,
    animations: {
      standing,
      walking,
      attacking,
      defending,
      dying,
    },
    effects: {
      ready: (percent: number, hasFinale = false) => {
        for (const readyState of readyStates) {
          readyState.visible = true;
          readyState.alpha = Math.max(
            0,
            Math.min(readyState.alpha + percent, 1)
          );

          if (hasFinale) {
            readyState.tint = CHANCE.pickone([
              colors.red,
              colors.yellow,
              colors.blue,
            ]);
            readyState.blendMode = PIXI.BLEND_MODES.OVERLAY;
          }
        }

        return readyStates[0].alpha;
      },
      unready: () => {
        for (const readyState of readyStates) {
          readyState.visible = false;
          readyState.alpha = 0;
          readyState.tint = colors.black;
          readyState.blendMode = PIXI.BLEND_MODES.ERASE;
        }
      },
    },
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
    animations: {
      standing: idleAnimation,
      walking: activeAnimation,
      attacking: activeAnimation,
      defending: idleAnimation,
      dying: idleAnimation,
    },
    effects: {
      ready: () => 0,
      unready: () => {},
    },
  };
};
