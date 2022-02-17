import * as PIXI from "pixi.js";
import { loadJobAnimations } from "../common";
import Chance from "chance";

const CHANCE = new Chance();

export class Entity {
  id = CHANCE.guid();
  name = "";
  loaded = false;
  container: null | PIXI.Container = null;
  animations: null | EntityAnimations = null;

  constructor(_name: string) {
    this.name = _name;
  }

  async load() {
    if (!this.loaded) {
      this.animations = await loadJobAnimations(this.name);
      this.container = this.animations.container;
      this.loaded = true;
    }
  }
}
