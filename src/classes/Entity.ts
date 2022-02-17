import * as PIXI from "pixi.js";
import { loadEntityAnimations } from "../common";
import { allSkills, entitySkills, entityStats } from "../data";
import Chance from "chance";

const CHANCE = new Chance();

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

  constructor(_name: EntityName) {
    this.name = _name;
  }

  public async load() {
    const name = this.name as EntityName;

    if (!this.loaded) {
      this.animations = await loadEntityAnimations(name);
      this.loaded = true;
    }

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
    const stats = this.currentStats!;
    const hpAfterAttack = Math.max(stats.HP - amount, 0);

    stats.HP = hpAfterAttack;

    if (stats.HP === 0) {
      this.die();
    }
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

      entry.play();
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
}

export type EntityType = typeof Entity;
