import * as PIXI from "pixi.js";
import Chance from "chance";
import { AIConfig, ais, Foe, FoeKind, foes } from "../../data";
import { config, loadFoeAnimations } from "../../common";
import { BattleEntityWithUI } from "./BattleEntityWithUI";

const CHANCE = new Chance();
const percentChance = (likelihood: number) => CHANCE.bool({ likelihood });

export class FoeEntity extends BattleEntityWithUI {
  ai: null | AIConfig = null;
  foe: null | Foe = null;
  acting = false;
  lastBuffTurnsAgo = config.AI_TURNS_BEFORE_FIRST_BUFF;

  public get hpPercentage() {
    if (this.currentStats && this.maxStats) {
      return this.currentStats.HP / this.maxStats.HP;
    } else {
      return 1;
    }
  }

  public constructor(_name: FoeKind, _screen: PIXI.Container) {
    super(_name, _screen, "foe", loadFoeAnimations);
    this.loadAI();
  }

  public update() {
    super.update();

    if (this.foe && this.ai) {
      // Am I ready to act?
      if (this.isReady) {
        this.resetATB();

        // Should I run away, if I can?
        if (!this.acting) {
          const { canEscape } = this.foe;
          if (canEscape) {
            const { escape } = this.ai.thresholds;
            const shouldTryToEscape = this.hpPercentage <= escape;

            if (shouldTryToEscape) {
              const didEscape = CHANCE.bool({
                likelihood: config.AI_ESCAPE_SUCCESS_RATE,
              });

              if (didEscape) {
                this.escape();
              } else {
                // Display message.
              }

              this.acting = true;
            }
          }
        }

        // Should I buff myself, if possible?
        if (!this.acting) {
          const { buff } = this.foe;

          if (buff) {
            const turnsEachBuff = Math.ceil(
              config.AI_DEFAULT_BUFF_RATE_IN_TURNS * this.ai.frequencies.buff
            );

            if (this.lastBuffTurnsAgo >= turnsEachBuff) {
              this.lastBuffTurnsAgo = 0;
              this.acting = true;
              this.selfBuff();
            } else {
              this.lastBuffTurnsAgo++;
            }
          }
        }

        // Should I cast a skill, if possible?
        if (!this.acting) {
          const { cast } = this.ai.frequencies;
          const willCast = percentChance(
            config.AI_DEFAULT_SKILL_CAST_RATE * cast
          );

          if (willCast) {
            this.acting = true;
            this.castSkill();
          } else {
            // Nothing else to do, let's attack.
            this.attackPlayer();
          }
        }
      }
    }
  }

  private escape() {
    // window.alert(`${this.goesBy} escaped.`);
  }

  private selfBuff() {
    // window.alert(`${this.goesBy} buffed itself.`);
  }

  private castSkill() {
    // window.alert(`${this.goesBy} cast a skill.`);
  }

  private attackPlayer() {
    // window.alert(`${this.goesBy} attacked a player.`);
  }

  private loadAI() {
    this.foe = (foes as any)[this.name] as Foe;
    this.ai = ais[this.foe.ai];
    if (this.foe && this.ai) {
      return true;
    } else {
      throw new Error();
    }
  }
}
