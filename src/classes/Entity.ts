import * as PIXI from "pixi.js";
import { colors, loadEntityAnimations, basicTextStyle } from "../common";
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
  displayingDamageTaken = false;
  damageTakenText: null | PIXI.Text = null;
  damageTakenTextVelocity = 0;
  damageTakenFlashCount = 0;

  constructor(_name: EntityName) {
    this.name = _name;
  }

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

  private hideAllAnimations() {
    if (this.animations) {
      const { job, container, ...animations } = this.animations;

      for (const animation of Object.values(animations)) {
        animation.stop();
        animation.visible = false;
      }
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
    const dying = this.showAnimation("dying");
    dying.loop = false;
  }

  private update() {
    if (this.displayingDamageTaken) {
      this.liftDamageTaken();
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
}

export type EntityType = typeof Entity;
