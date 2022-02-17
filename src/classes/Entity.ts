import * as PIXI from "pixi.js";
import {
  colors,
  config,
  loadEntityAnimations,
  basicTextStyle,
} from "../common";
import { allSkills, entitySkills, entityStats } from "../data";
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
  castShadow: null | PIXI.Graphics = null;

  // Moving
  movingDirection: "back" | "none" | "forward" = "none";
  movingVelocity = 0;
  movedDistance = 0;

  // Damage Taken
  displayingDamageTaken = false;
  damageTakenText: null | PIXI.Text = null;
  damageTakenTextVelocity = 0;
  damageTakenFlashCount = 0;

  constructor(_name: EntityName) {
    this.name = _name;
  }

  // Public
  public get isDead() {
    return Boolean(this.currentStats?.HP === 0);
  }

  public async load() {
    const name = this.name as EntityName;

    if (!this.loaded) {
      this.animations = await loadEntityAnimations(name);
      this.loaded = true;
    }

    ticker.add(this.update.bind(this));

    this.container = this.animations!.container;

    this.addShadow();

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
  }

  public defend() {
    const defend = this.showAnimation("defending");
    defend.loop = false;
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

  // Private
  private hideAllAnimations() {
    if (this.animations) {
      const { job, container, ...animations } = this.animations;

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

  private addShadow() {
    if (this.container) {
      const circle = new PIXI.Graphics();

      circle.beginFill(colors.grey);
      circle.drawCircle(0, 0, 32);
      circle.endFill();
      circle.alpha = 0.75;
      circle.width = 25 * config.ENTITY_SCALE;
      circle.height = 32;
      circle.x = this.container.width / 2 + 12;
      circle.y = this.container.height - 12;
      circle.blendMode = PIXI.BLEND_MODES.MULTIPLY;

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
      }
    }
  }
}

export type EntityType = typeof Entity;
