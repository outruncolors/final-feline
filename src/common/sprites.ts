import * as PIXI from "pixi.js";
import Chance from "chance";
import { Resource } from "pixi.js";
import * as config from "./config";
import { colors } from "./colors";
import {
  AfflictionKind,
  SkillKind,
  LocationKind,
  EntityKind,
  ItemKind,
} from "../data";

export type EntityAnimationLoader = (key: EntityKind) => EntityAnimations;

export interface EntityAnimations {
  container: PIXI.Container;
  effects: {
    ready: (percent: number, hasFinaleReady: boolean) => number;
    unready: () => void;
    die: () => void;
  };
  animations: {
    standing: PIXI.AnimatedSprite;
    walking: PIXI.AnimatedSprite;
    attacking: PIXI.AnimatedSprite;
    defending: PIXI.AnimatedSprite;
    dying: PIXI.AnimatedSprite;
  };
}

const CHANCE = new Chance();

export const loadVisualAsset = (which: string, animated = false) => {
  const sheet =
    PIXI.Loader.shared.resources[`/assets/sprites.json`].spritesheet;

  if (sheet) {
    const asset = animated
      ? new PIXI.AnimatedSprite(sheet.animations[which])
      : new PIXI.Sprite(sheet.textures[which]);

    return asset;
  } else {
    throw new Error();
  }
};

export const loadSprite = (sprite: string) =>
  loadVisualAsset(sprite) as PIXI.Sprite;

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
  const readyStates = ["stand", "walk", "attack", "defend", "down"].map(
    (name) => loadAnimation(withPrefix(name))
  );

  let i = 0;
  const filter = new PIXI.filters.ColorMatrixFilter();
  filter.hue(CHANCE.integer({ min: -40, max: 40 }), true);
  for (const animation of [standing, walking, attacking, defending, dying]) {
    animation.scale.set(config.ENTITY_SCALE);
    animation.animationSpeed = config.SLOWED_ANIMATION_SPEED;
    animation.visible = false;
    container.addChild(animation);

    animation.filters = [filter];

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
      die: () => {},
    },
  };
};

export const loadJobPortrait = (job: EntityKind) => {
  const {
    animations: { standing },
  } = loadJobAnimations(job);
  const [idle] = standing.textures as Array<PIXI.Texture<Resource>>;
  const portrait = new PIXI.Sprite(idle);
  portrait.scale.set(config.ENTITY_SCALE / 2);

  return portrait;
};

export const loadFoeAnimations = (foe: EntityKind): EntityAnimations => {
  const container = new PIXI.Container();
  const getIdleAnimation = () => {
    const activeAnimation = loadAnimation(`foes/${foe}/foes_${foe}`);
    const [idle] = activeAnimation.textures;
    const animation = new PIXI.AnimatedSprite([idle] as Array<
      PIXI.Texture<Resource>
    >);
    animation.loop = false;
    animation.stop();
    return animation;
  };
  const getActiveAnimation = () => {
    const animation = loadAnimation(`foes/${foe}/foes_${foe}`);
    animation.play();
    animation.loop = true;
    return animation;
  };

  const livingStates = [
    getActiveAnimation(),
    getActiveAnimation(),
    getActiveAnimation(),
    getIdleAnimation(),
    getIdleAnimation(),
  ];
  const [standing, walking, attacking, defending, dying] = livingStates;
  const dyingStates = [
    getActiveAnimation(),
    getActiveAnimation(),
    getActiveAnimation(),
    getIdleAnimation(),
    getIdleAnimation(),
  ];

  const filter = new PIXI.filters.ColorMatrixFilter();
  filter.hue(
    CHANCE.integer({
      min: -config.ENTITY_HUE_TWEAK_PARAMETER,
      max: config.ENTITY_HUE_TWEAK_PARAMETER,
    }),
    true
  );

  for (const animation of [standing, walking, attacking, defending, dying]) {
    animation.scale.set(config.ENTITY_SCALE);
    animation.animationSpeed = config.SLOWED_ANIMATION_SPEED;
    animation.visible = false;

    animation.filters = [filter];

    container.addChild(animation);
  }

  let i = 0;
  for (const animation of [standing, walking, attacking, defending, dying]) {
    animation.scale.set(config.ENTITY_SCALE);
    animation.animationSpeed = config.SLOWED_ANIMATION_SPEED;
    animation.visible = false;
    container.addChild(animation);

    const dyingState = dyingStates[i];
    dyingState.alpha = 1;
    dyingState.tint = colors.red;
    // dyingState.blendMode = PIXI.BLEND_MODES.ADD;
    dyingState.visible = false;
    animation.addChild(dyingState);

    i++;
  }

  standing.visible = true;

  return {
    container,
    animations: {
      standing: getIdleAnimation(),
      walking: getActiveAnimation(),
      attacking: getActiveAnimation(),
      defending: getIdleAnimation(),
      dying: getIdleAnimation(),
    },
    effects: {
      ready: () => 0,
      unready: () => {},
      die: () => {
        for (const state of livingStates) {
          if (state.visible) {
            state.visible = CHANCE.bool({ likelihood: 10 });
          } else {
            state.visible = true;
          }

          state.tint = colors.red;
          state.alpha = Math.max(0, state.alpha - 0.01);
        }

        for (const state of dyingStates) {
          state.visible = true;
          state.alpha = Math.max(0, state.alpha - 0.01);
        }
      },
    },
  };
};

// === Extras ===
export const loadImpactAnimation = () => {
  const animation = loadExtraAnimation("impact");
  const allTextures = animation.textures as Array<PIXI.Texture<Resource>>;
  const textures = CHANCE.shuffle(allTextures.concat(allTextures)).slice(2);

  const impact = new PIXI.AnimatedSprite(textures);
  impact.scale.set(config.IMPACT_SCALE);
  impact.animationSpeed = config.IMPACT_ANIMATION_SPEED;
  impact.blendMode = PIXI.BLEND_MODES.ADD;
  impact.anchor.set(0.5);

  return impact;
};
