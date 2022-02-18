import * as PIXI from "pixi.js";
import {
  colors,
  config,
  loadEntityAnimations,
  basicTextStyle,
} from "../common";
import { AllSkills, allSkills, entitySkills, entityStats } from "../data";
import Chance from "chance";

const CHANCE = new Chance();

const ticker = PIXI.Ticker.shared;

export class Entity {
  id = CHANCE.guid();
  name: "" | EntityName = "";
  stage = 1;
  loaded = false;
  container: null | PIXI.Container = null;
  animations: null | EntityAnimations = null;
  baseStats: null | EntityStats = null;
  currentStats: null | Record<StatName, number> = null;
  maxStats: null | Record<StatName, number> = null;
  baseSkills: EntitySkill[] = [];
  meandering = false;

  // Sprite Effects
  castShadow: null | PIXI.Graphics = null;
  castingAura: null | PIXI.Graphics = null;
  castingOverlay: null | PIXI.Graphics = null;
  castingFlashCount = 0;
  targettedAura: null | PIXI.Graphics = null;
  targettedOverlay: null | PIXI.Graphics = null;
  targettedFlashCount = 0;

  // Moving
  movingDirection: "back" | "none" | "forward" = "none";
  movingVelocity = 0;
  movedDistance = 0;

  // Damage Taken
  displayingDamageTaken = false;
  damageTakenText: null | PIXI.Text = null;
  damageTakenTextVelocity = 0;
  damageTakenFlashCount = 0;

  // Clips
  onFinishAnimation: () => void = () => {};

  constructor(_name: EntityName) {
    this.name = _name;
  }

  // Public
  public get isDead() {
    return Boolean(this.currentStats?.HP === 0);
  }

  public async load() {
    const name = this.name as EntityName;
    this.animations = loadEntityAnimations(name)!;

    this.loaded = true;

    ticker.add(this.update.bind(this));

    this.container = this.animations!.container;

    this.addShadow();
    this.addCastingAura();
    this.addTargettedAura();

    // Add Stats
    const stats = entityStats[name];
    this.baseStats = stats;
    this.currentStats = this.maxStats = Object.entries(stats).reduce(
      (prev, next) => {
        const [stat, value] = next;

        if (stat === "ATB") {
          prev[stat] = value;
        } else {
          prev[stat as StatName] = value[this.stage];
        }

        return prev;
      },
      {
        STR: 0,
        AGI: 0,
        MAG: 0,
        STA: 0,
        HP: 0,
        MP: 0,
        ATB: 0,
      } as Record<StatName, number>
    );
    this.maxStats.ATB = 100;

    // Add Skills
    for (const skillName of entitySkills[name]) {
      const skill = allSkills[skillName];

      if (skill) {
        this.baseSkills.push(skill);
      } else {
        throw new Error(`Invalid skill ${skillName} missing entry.`);
      }
    }
  }

  public damageBy(amount: number) {
    if (!this.isDead) {
      const stats = this.currentStats!;
      const hpAfterAttack = Math.max(stats.HP - amount, 0);
      stats.HP = hpAfterAttack;

      this.displayDamageTaken(amount);
    }
  }

  public walk() {
    this.showAnimation("walking");
  }

  public stand() {
    this.showAnimation("standing");
  }

  public attack() {
    const attack = this.showAnimation("attacking");
    attack.loop = false;
    this.perform("attacking");
  }

  public defend() {
    const defend = this.showAnimation("defending");
    defend.loop = false;
  }

  public cast(skill: keyof AllSkills, target: Entity) {
    this.perform("attacking", 2500, () => {
      if (
        this.container &&
        this.castingAura &&
        this.castingOverlay &&
        target.targettedAura &&
        target.targettedOverlay
      ) {
        this.hideEffects();
        this.castingAura.visible = true;
        this.castingOverlay.visible = true;

        setTimeout(() => {
          this.hideEffects();

          target.hideEffects();
          target.targettedAura!.visible = true;
          target.targettedOverlay!.visible = true;

          setTimeout(() => {
            target.hideEffects();
          }, 1200);
        }, 1200);
      }
    });
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

  public meander() {
    this.meandering = true;
  }

  // Private
  private hideAllAnimations() {
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
      this.castShadow.width = 25 * config.ENTITY_SCALE;
    }
  }

  private showAnimation(animation: keyof EntityAnimations) {
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

  private die() {
    const dying = this.showAnimation("dying") as PIXI.AnimatedSprite;
    dying.loop = false;
    dying.onComplete = () => {
      if (this.castShadow) {
        this.castShadow.width = 60 * config.ENTITY_SCALE;
      }
    };
  }

  private update() {
    if (this.displayingDamageTaken) {
      this.liftDamageTaken();
    }

    if (this.movingDirection === "forward") {
      this.moveForward();
    } else if (this.movingDirection === "back") {
      this.moveBackward();
    } else if (this.meandering) {
      this.startMeandering();
    }

    if (this.castingAura?.visible) {
      this.flashCastingAura();
    }

    if (this.targettedAura?.visible) {
      this.flashTargettedAura();
    }
  }

  private displayDamageTaken(amount: number) {
    if (this.container) {
      const damagedBy = amount * -1;
      this.displayingDamageTaken = true;
      this.damageTakenText = new PIXI.Text(damagedBy.toString(), {
        ...basicTextStyle,
        fontSize: 52,
      });
      this.damageTakenText.anchor.set(0.5);
      this.damageTakenText.position.set(
        this.container.width / 2,
        this.container.height / 2
      );
      this.container.addChild(this.damageTakenText);

      if (damagedBy > 0) {
        this.damageTakenText.text = `+${this.damageTakenText.text}`;
        this.damageTakenText.tint = colors.green;
      }
    }
  }

  private liftDamageTaken() {
    if (this.container && this.displayingDamageTaken && this.damageTakenText) {
      this.damageTakenTextVelocity += 0.3;
      this.damageTakenText.position.y -= this.damageTakenTextVelocity;

      this.damageTakenFlashCount++;

      if (this.damageTakenFlashCount % 10 === 0) {
        this.container.alpha = this.container.alpha === 0.5 ? 1 : 0.5;
        this.damageTakenFlashCount = 0;
      }

      if (this.damageTakenText.getGlobalPosition().y <= 0) {
        this.hideDamageTaken();
      }
    }
  }

  private hideDamageTaken() {
    if (this.container && this.displayingDamageTaken && this.damageTakenText) {
      this.damageTakenText.destroy();
      this.displayingDamageTaken = false;
      this.damageTakenTextVelocity = 0;
      this.damageTakenFlashCount = 0;
      this.container.alpha = 1;

      if (this.isDead) {
        this.die();
      }
    }
  }

  // Effects
  private hideEffects() {
    if (this.container) {
      for (const effect of [
        this.castShadow,
        this.castingAura,
        this.castingOverlay,
        this.targettedAura,
        this.targettedOverlay,
      ]) {
        if (effect) {
          effect.alpha = 0.3;
          effect.visible = false;
        }
      }

      this.castShadow!.alpha = 0.75;
      this.castShadow!.visible = true;
    }
  }

  private addEffect(fill: number, blendMode: PIXI.BLEND_MODES) {
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

  private addOverlay(fill: number) {
    if (this.container) {
      const overlay = this.addEffect(fill, PIXI.BLEND_MODES.COLOR_DODGE);
      overlay.alpha = 0.5;
      overlay.width = 192;
      overlay.height = this.container.height;
      overlay.position.y -= 170;

      return overlay;
    } else {
      throw new Error();
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

  private addCastingAura() {
    if (this.container) {
      this.castingAura = this.addEffect(colors.white, PIXI.BLEND_MODES.ADD);
      this.castingAura.visible = false;
      this.container.addChildAt(this.castingAura, 0);

      this.castingOverlay = this.addOverlay(colors.white);
      this.castingOverlay.visible = false;
      this.container.addChild(this.castingOverlay);
    }
  }

  private addTargettedAura() {
    if (this.container) {
      this.targettedAura = this.addEffect(
        colors.red,
        PIXI.BLEND_MODES.COLOR_BURN
      );
      this.targettedAura.visible = false;
      this.container.addChildAt(this.targettedAura, 0);

      this.targettedOverlay = this.addOverlay(colors.red);
      this.targettedOverlay.visible = false;
      this.container.addChild(this.targettedOverlay);
    }
  }

  private flashCastingAura() {
    if (this.castingOverlay?.visible) {
      this.castingFlashCount++;

      if (this.castingFlashCount % 7 === 0) {
        this.castingOverlay.alpha += 0.1;

        if (this.castingOverlay.alpha >= 0.6) {
          this.castingOverlay.alpha = 0.3;
        }

        this.castingFlashCount = 0;
      }
    }
  }

  private flashTargettedAura() {
    if (this.targettedOverlay?.visible) {
      this.castingFlashCount++;

      if (this.castingFlashCount % 7 === 0) {
        this.targettedOverlay.alpha += 0.1;

        if (this.targettedOverlay.alpha >= 0.6) {
          this.targettedOverlay.alpha = 0.3;
        }

        this.castingFlashCount = 0;
      }
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

  private startMeandering() {
    const willMove = CHANCE.bool({ likelihood: 1 });

    if (willMove) {
      const method = CHANCE.pickone([
        this.stepUp.bind(this),
        this.stepBack.bind(this),
      ]);
      method();
    }
  }

  // Clips
  public perform(
    animation: keyof EntityAnimations,
    duration = 1250,
    onSteppedForward: () => void = () => {},
    onSteppedBackward: () => void = () => {}
  ) {
    this.onFinishAnimation = () => {
      const anim = this.showAnimation(animation) as PIXI.AnimatedSprite;
      anim.onLoop = () => {
        anim.stop();
        onSteppedForward();
      };

      setTimeout(() => {
        this.onFinishAnimation = () => {
          onSteppedBackward();
          this.onFinishAnimation = () => {};
        };

        this.stepBack();
      }, duration);
    };

    this.stepUp();
  }
}

export type EntityType = typeof Entity;
