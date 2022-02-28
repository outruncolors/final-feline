import Chance from "chance";
import * as PIXI from "pixi.js";
import { sound, filters } from "@pixi/sound";
import {
  config,
  EntityAnimationLoader,
  EntityAnimations,
  loadAfflictionAnimation,
  loadCastingAnimations,
  loadImpactAnimation,
  loadItemAnimation,
  loadSkillAnimation,
} from "../../common";
import {
  AfflictionKind,
  EntityKind,
  EntityStats,
  ItemKind,
  items,
  Skill,
  SkillKind,
  skills,
} from "../../data";
import type { Battle, ItemAndQuantity } from "../Battle";
import { BattleMessage } from "../Message";
import { Entity } from "./Entity";

export type EntityStatsKind = keyof EntityStats;

const CHANCE = new Chance();

export class BattleEntity extends Entity {
  lastVitalStats = {
    HP: 0,
    MP: 0,
    ATB: 0,
    FIN: 0,
  };
  battle: null | Battle = null;
  afflictions: string[] = [];
  afflictionAnimations: PIXI.AnimatedSprite[] = [];
  items: ItemAndQuantity[] = [];
  currentStats: null | Record<EntityStatsKind, number> = null;
  maxStats: null | Record<EntityStatsKind, number> = null;
  isFoe: boolean;
  isRecovering = true;
  loader: EntityAnimationLoader;

  public get isDead() {
    return Boolean(this.currentStats?.HP === 0);
  }

  public get isReady() {
    return Boolean(this.lastVitalStats.ATB === 100);
  }

  public get hasFinaleReady() {
    return Boolean(this.lastVitalStats.FIN === 100);
  }

  private get formattedStats() {
    return Object.entries(this.baseStats ?? {}).reduce(
      (prev, next) => {
        const [stat, value] = next;
        prev[stat as EntityStatsKind] =
          typeof value === "number" ? value : value[this.stage];
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
      } as Record<EntityStatsKind, number>
    );
  }

  public constructor(
    _name: EntityKind,
    _screen: PIXI.Container,
    _relationship: "friend" | "foe" = "friend",
    _loader: EntityAnimationLoader
  ) {
    super(_name, _screen);
    this.isFoe = _relationship === "foe";
    this.loader = _loader;

    if (this.isFoe) {
      this.goesBy = this.name;
    }
  }

  public async load() {
    await super.load();

    this.currentStats = { ...this.formattedStats };
    this.maxStats = { ...this.formattedStats };
    this.maxStats.ATB = 100;
    this.maxStats.FIN = 100;

    if (this.isFoe) {
      this.showAnimation("walking");
    }

    this.syncStats();

    sound.add("punch", "/assets/sounds/punch.wav");
  }

  public register(forBattle: Battle, withItems: ItemAndQuantity[] = []) {
    this.battle = forBattle;
    this.items = withItems;
  }

  public update() {
    super.update();

    const stats = this.currentStats;

    if (stats) {
      if (!this.isDead && this.isRecovering) {
        // stats.FIN = Math.min(stats.FIN + 0.3, 100);
        stats.ATB = Math.min(stats.ATB + 0.3, 100);
      }

      const isNowReady = this.lastVitalStats.ATB !== 100 && stats.ATB === 100;

      if (!this.isDead && isNowReady) {
        if (this.isFoe) {
          this.showAnimation("walking");
        } else {
          this.showAnimation("standing");
        }
      }

      this.syncStats();
    }
  }

  public syncStats() {
    const stats = this.currentStats;

    if (stats) {
      this.lastVitalStats.HP = stats.HP;
      this.lastVitalStats.MP = stats.MP;
      this.lastVitalStats.ATB = stats.ATB;
      this.lastVitalStats.FIN = stats.FIN;
    }
  }

  public attack(target: BattleEntity) {
    this.resetATB();
    this.isRecovering = false;
    const attack = this.showAnimation("attacking");
    attack.loop = false;
    this.perform("attacking", 2500, () => {
      target.lowerHPBy(10);
      this.isRecovering = true;
      target.impact();

      let count = 0;
      const playPunchSound = () => {
        const telephone = new filters.TelephoneFilter();
        const distortion = new filters.DistortionFilter();

        distortion.amount = CHANCE.integer({ min: 2, max: 12 });
        const volume = CHANCE.floating({
          min: 0.05,
          max: 0.1,
        });

        sound.play("punch", {
          volume,
          loop: false,
          filters: [telephone, distortion],
          complete: () => {
            count++;
            if (count < 4) {
              playPunchSound();
            }
          },
        });
      };

      playPunchSound();
    });
  }

  public defend() {
    this.currentStats!.ATB = 0;
    this.isRecovering = false;
    const defend = this.showAnimation("defending");
    defend.loop = false;
    defend.onComplete = () => {
      this.isRecovering = true;
    };
  }

  public resetATB() {
    this.currentStats!.ATB = 0;
  }

  public cast(skill: SkillKind, target: BattleEntity) {
    const skillEntry = skills[skill] as Skill;

    if (this.currentStats!.MP >= skillEntry.cost) {
      this.resetATB();
      this.isRecovering = false;
      this.lowerMPBy(skillEntry.cost);

      const castMessage = new BattleMessage(
        this.screen,
        `${this.name} cast ${skill}`,
        {
          onFlashEnd: () => {
            this.screen.removeChild(castMessage.container);
            castMessage.container.destroy();
          },
        }
      );
      this.screen.addChild(castMessage.container);

      const { behind, front, under } = loadCastingAnimations();

      this.perform("attacking", 2500, () => {
        if (this.container) {
          this.hideEffects();

          this.container.addChildAt(behind, 0);
          this.container.addChildAt(under, 1);
          this.container.addChild(front);

          for (const castingAnimation of [behind, front, under]) {
            castingAnimation.loop = false;
            castingAnimation.play();
            castingAnimation.onComplete = () => {
              castingAnimation.destroy();
            };
          }

          setTimeout(() => {
            this.hideEffects();
            target.hideEffects();

            const animation = loadSkillAnimation(skill) as PIXI.AnimatedSprite;
            animation.loop = false;
            animation.animationSpeed =
              skillEntry.loopSpeed ?? config.STANDARD_ANIMATION_SPEED;
            animation.scale.set(config.ENTITY_SCALE);

            if (skillEntry.offset) {
              const [x, y] = skillEntry.offset;
              animation.position.x += x;
              animation.position.y += y;
            }

            animation.onComplete = () => {
              if (counter > 0) {
                counter--;
                animation.gotoAndPlay(0);
              } else {
                target.hideEffects();
                target.container?.removeChild(animation);
                animation.destroy();
                skillEntry.effect(this, target);

                if (skillEntry.impactsTarget) {
                  target.impact();
                }

                // Use method to gauge strength algorithm.
                target.lowerHPBy(2000);

                if (skillEntry.affliction) {
                  const [affliction, chanceToInflict] = skillEntry.affliction;
                  const willInflict = CHANCE.bool({
                    likelihood: chanceToInflict,
                  });

                  if (willInflict) {
                    target.inflict(affliction);
                  }
                }

                this.isRecovering = true;
              }
            };

            let counter = skillEntry.loopCount ?? 1;
            counter--;
            animation.play();

            target.container?.addChild(animation);
          }, 1200);
        }
      });
    }
  }

  public useItem(item: ItemKind, target: BattleEntity) {
    this.resetATB();
    this.isRecovering = false;
    const itemEntry = items[item];
    const attacking = this.showAnimation("attacking");
    attacking.loop = false;
    attacking.onComplete = () => {
      attacking.stop();
      attacking.loop = true;
      itemEntry.effect(this, target);
      this.isRecovering = true;
    };

    if (target.container && target.animations && itemEntry) {
      const animation = loadItemAnimation(itemEntry.name);
      animation.play();
      animation.loop = false;
      target.container.addChild(animation);

      animation.position.x =
        target.animations.animations.standing.width / 2 - animation.height / 2;
      animation.position.y =
        target.animations.animations.standing.height / 2 - animation.height / 2;

      let times = 0;
      const shrinking = setInterval(() => {
        if (target.container) {
          if (times === 10) {
            clearInterval(shrinking);
            target.container?.removeChild(animation);
          } else {
            animation.alpha -= 0.05;
            times++;
          }
        }
      }, 250);
    }
  }

  public inflict(affliction: AfflictionKind) {
    if (!this.afflictions.includes(affliction)) {
      this.afflictions.push(affliction);

      const afflictionAnimation = loadAfflictionAnimation(affliction);
      afflictionAnimation.position.x += 64 * this.afflictions.length - 1;
      afflictionAnimation.scale.set(config.AFFLICTION_SCALE);
      afflictionAnimation.animationSpeed = config.SLOWED_ANIMATION_SPEED;
      afflictionAnimation.play();
      this.afflictionAnimations.push(afflictionAnimation);
      this.container?.addChild(afflictionAnimation);

      const afflictedMessage = new BattleMessage(
        this.screen,
        `${this.name} was ${affliction}`,
        {
          onFlashEnd: () => {
            this.screen.removeChild(afflictedMessage.container);
            afflictedMessage.container.destroy();
          },
        }
      );
      this.screen.addChild(afflictedMessage.container);
    }
  }

  public recoverHP(amount: number) {
    if (!this.isDead) {
      this.lowerHPBy(-amount);
    }
  }

  public lowerHPBy(amount: number) {
    if (!this.isDead) {
      const stats = this.currentStats!;
      let hpAfterAttack = Math.max(stats.HP - amount, 0);
      hpAfterAttack = Math.min(hpAfterAttack, this.maxStats!.HP);
      stats.HP = hpAfterAttack;

      if (this.isDead) {
        this.die();
      }
    }
  }

  private die() {
    const dying = this.showAnimation("dying");
    dying.loop = false;
    dying.onComplete = () => {
      if (this.castShadow) {
        this.castShadow.width =
          config.CAST_SHADOW_WIDTH_DOWN * config.ENTITY_SCALE;
      }
    };
  }

  public recoverMP(amount: number) {
    if (!this.isDead) {
      this.lowerMPBy(-amount);
    }
  }

  public lowerMPBy(amount: number) {
    if (!this.isDead) {
      const stats = this.currentStats!;
      let mpAfter = Math.max(stats.MP - amount, 0);
      mpAfter = Math.min(mpAfter, this.maxStats!.MP);
      stats.MP = mpAfter;
    }
  }

  public impact() {
    if (this.animations?.container) {
      const impact = loadImpactAnimation();
      const randomizeImpactPosition = () => {
        if (this.animations?.container && !impact.destroyed) {
          impact.position.set(
            CHANCE.integer({
              min: 0,
              max: this.animations.container.width - impact.width,
            }),
            CHANCE.integer({
              min: 0,
              max: this.animations.container.height - impact.height,
            })
          );
        }
      };

      impact.loop = false;
      impact.play();
      impact.onFrameChange = () => {
        randomizeImpactPosition();
      };
      impact.onComplete = () => {
        if (this.animations?.container) {
          this.animations.container.removeChild(impact);
          impact.destroy();
        }
      };
      this.animations.container.addChild(impact);

      randomizeImpactPosition();
    }
  }

  public perform(
    animation: keyof EntityAnimations["animations"],
    duration = 1250,
    onSteppedForward: () => void = () => {},
    onSteppedBackward: () => void = () => {}
  ) {
    this.onFinishAnimation = () => {
      const anim = this.showAnimation(animation) as PIXI.AnimatedSprite;
      anim.loop = true;

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
