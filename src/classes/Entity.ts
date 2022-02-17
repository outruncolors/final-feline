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
  currentStats: null | EntityStats = null;
  maxStats: null | EntityStats = null;
  baseSkills: EntitySkill[] = [];

  constructor(_name: EntityName) {
    this.name = _name;
  }

  async load() {
    if (!this.loaded) {
      const name = this.name as EntityName;

      this.animations = await loadEntityAnimations(name);
      this.loaded = true;
      this.container = this.animations.container;

      // Add Stats
      const stats = entityStats[name];
      this.baseStats = this.currentStats = this.maxStats = stats;

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
  }
}

export type EntityType = typeof Entity;
