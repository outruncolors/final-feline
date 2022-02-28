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

  public constructor(_name: FoeKind, _screen: PIXI.Container) {
    super(_name, _screen, "foe", loadFoeAnimations);
    this.loadAI();
  }

  public update() {
    super.update();

    if (this.foe && this.ai && !this.acting) {
      // Am I ready to act?
      if (this.isReady) {
        // Should I run away, if I can?
        if (this.ai.behaviors?.canEscape) {
          const { escapeAtHP } = this.ai.thresholds;
          const shouldTryToEscape = this.hpPercentage <= escapeAtHP;

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
            return;
          }
        }

        // Should I buff myself, if possible?
        const { buff } = this.foe;

        if (buff) {
          const turnsEachBuff = Math.ceil(
            config.AI_DEFAULT_BUFF_RATE_IN_TURNS * this.ai.frequencies.buff
          );

          if (this.lastBuffTurnsAgo >= turnsEachBuff) {
            this.lastBuffTurnsAgo = 0;
            this.acting = true;
            return this.selfBuff();
          } else {
            this.lastBuffTurnsAgo++;
          }
        }

        // Should I cast a skill, if possible?
        const { cast } = this.ai.frequencies;
        const willCast = percentChance(
          config.AI_DEFAULT_SKILL_CAST_RATE * cast
        );

        if (willCast) {
          this.acting = true;
          return this.castSkill();
        }
      }
      
      this.acting = true;
      return this.attackPlayer();
    }
  }

  private escape() {
    // window.alert(`${this.goesBy} escaped.`);
    this.acting = false;
  }

  private selfBuff() {
    // window.alert(`${this.goesBy} buffed itself.`);
    this.acting = false;
  }

  private selectTarget() {
    if (this.ai && this.battle) {
      const { playableParty } = this.battle;
      const validTargetExists = playableParty.some((target) => !target.isDead);

      if (validTargetExists) {
        let target = CHANCE.pickone(playableParty);

        if (this.ai?.behaviors?.isRuthless) {
          const [lowestHPTarget] = [...playableParty].sort(
            (a, b) => a.hpPercentage - b.hpPercentage
          );

          target = lowestHPTarget;
        } else {
          do {
            target = CHANCE.pickone(playableParty);
          } while (target.isDead);

          return target;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  private selectSkill() {
    if (this.foe) {
      for (let i = 0; i < this.foe.skills.length; i++) {
        const skill = this.foe.skills[i];
        const canSelect = this.canCast(skill);

        if (canSelect) {
          const likelihood = this.foe.skillChances[skill] ?? 100;
          const willSelect = percentChance(likelihood);

          if (willSelect) {
            return skill;
          }
        }
      }

      // Nothing picked naturally, randomize.
      return CHANCE.pickone(this.foe.skills);
    } else {
      throw new Error();
    }
  }

  private async castSkill() {
    const target = this.selectTarget();
    const skill = this.selectSkill();

    if (target) {
      await this.cast(skill, target);
      this.acting = false;
    }
  }

  private async attackPlayer() {
    const target = this.selectTarget();

    if (target) {
      await this.attack(target);
      this.acting = false;
    }
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
