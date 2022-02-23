import Chance from "chance";
import * as PIXI from "pixi.js";
import {
  colors,
  config,
  EntityAnimationLoader,
  EntityAnimations,
} from "../../common";
import {
  entities,
  EntityKind,
  EntityStats,
  SkillKind,
  skills,
} from "../../data";

const CHANCE = new Chance();
const ticker = PIXI.Ticker.shared;

export class Entity {
  id = CHANCE.guid();
  name: EntityKind;
  goesBy = CHANCE.name();
  screen: PIXI.Container;
  stage = 1;
  loader: null | EntityAnimationLoader = null;
  loaded = false;
  container: null | PIXI.Container = null;
  animations: null | EntityAnimations = null;
  baseStats: null | EntityStats = null;
  baseSkills: SkillKind[] = [];
  castShadow: null | PIXI.Graphics = null;
  movingDirection: "back" | "none" | "forward" = "none";
  movingVelocity = 0;
  movedDistance = 0;
  onFinishAnimation: () => void = () => {};

  constructor(_name: EntityKind, _screen: PIXI.Container) {
    this.name = _name;
    this.screen = _screen;
  }

  public setLoader(loader: EntityAnimationLoader) {
    this.loader = loader;
  }

  public async load() {
    if (!this.loader) {
      throw new Error();
    }

    this.animations = this.loader(this.name);

    ticker.add(this.update.bind(this));

    this.container = this.animations!.container;

    this.addShadow();

    const { stats } = entities[this.name];
    this.baseStats = stats;

    for (const skillName of entities[this.name].skills) {
      const skill = skills[skillName];

      if (skill) {
        this.baseSkills.push(skillName);
      } else {
        throw new Error(`Invalid skill ${skillName} missing entry.`);
      }
    }

    this.loaded = true;
  }

  public stepUp() {
    this.movingVelocity = config.ENTITY_WALKING_VELOCITY;
    this.movingDirection = "forward";
    this.showAnimation("walking");
  }

  public stepBack() {
    if (this.container) {
      this.movingVelocity = config.ENTITY_WALKING_VELOCITY;
      this.movingDirection = "back";

      const walking = this.showAnimation("walking");
      walking.anchor.x = 1;
      walking.scale.x *= -1;
    }
  }

  public update() {
    if (this.movingDirection === "forward") {
      this.moveForward();
    } else if (this.movingDirection === "back") {
      this.moveBackward();
    }
  }

  public hideAllAnimations() {
    if (this.animations) {
      const { container, ...animations } = this.animations;

      for (const animation of Object.values(animations)) {
        animation.stop();
        animation.visible = false;
        animation.anchor.x = 0;

        if (animation.scale.x < 0) {
          animation.scale.x *= -1;
        }
      }
    }

    if (this.castShadow) {
      this.castShadow.width = config.CAST_SHADOW_WIDTH_UP * config.ENTITY_SCALE;
    }
  }

  public showAnimation(animation: keyof Omit<EntityAnimations, "container">) {
    if (this.animations) {
      const entry = this.animations[animation];

      this.hideAllAnimations();

      entry.gotoAndPlay(0);
      entry.visible = true;

      return entry;
    } else {
      throw Error();
    }
  }

  public addEffect(fill: number, blendMode: PIXI.BLEND_MODES) {
    if (this.container) {
      const circle = new PIXI.Graphics();

      circle.beginFill(fill);
      circle.drawCircle(0, 0, 32);
      circle.endFill();
      circle.alpha = 1;
      circle.width = 25 * config.ENTITY_SCALE;
      circle.height = 32;
      circle.x = this.container.width / 2 + 12;
      circle.y = this.container.height - 12;
      circle.blendMode = blendMode;
      circle.filters = [new PIXI.filters.BlurFilter()];

      return circle;
    } else {
      throw new Error();
    }
  }

  public hideEffects() {
    if (this.container) {
      for (const effect of [this.castShadow]) {
        if (effect) {
          effect.alpha = 0.3;
          effect.visible = false;
        }
      }

      this.castShadow!.alpha = 0.75;
      this.castShadow!.visible = true;
    }
  }

  private addShadow() {
    if (this.container) {
      const circle = this.addEffect(colors.grey, PIXI.BLEND_MODES.MULTIPLY);
      circle.alpha = 0.75;
      this.castShadow = circle;
      this.container.addChildAt(this.castShadow, 0);
    }
  }

  private moveForward() {
    if (this.container) {
      this.container.position.x += this.movingVelocity;
      this.movedDistance += this.movingVelocity;

      if (this.movedDistance >= config.ENTITY_MOVING_DISTANCE) {
        this.movingDirection = "none";
        this.movedDistance = 0;
        this.movingVelocity = 0;
        this.showAnimation("standing");
        this.onFinishAnimation();
      }
    }
  }

  private moveBackward() {
    if (this.container) {
      this.container.position.x -= this.movingVelocity;
      this.movedDistance += this.movingVelocity;

      if (this.movedDistance >= config.ENTITY_MOVING_DISTANCE) {
        this.movedDistance = 0;
        this.movingDirection = "none";
        this.movingVelocity = 0;
        this.showAnimation("standing");
        this.onFinishAnimation();
      }
    }
  }
}
