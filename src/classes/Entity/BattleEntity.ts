import Chance from "chance";
import * as PIXI from "pixi.js";
import {
  basicTextStyle,
  colors,
  config,
  EntityAnimationLoader,
  EntityAnimations,
  loadAfflictionAnimation,
  loadCastingAnimations,
  loadExtraAnimation,
  loadFoeAnimations,
  loadItemAnimation,
  loadJobAnimations,
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
import { BattleMessage } from "../Message";
import { BattleMenu } from "../Menu";
import { Entity } from "./Entity";
import type { Battle, ItemAndQuantity } from "../Battle";

export type EntityStatsKind = keyof EntityStats;

const CHANCE = new Chance();

export class BattleEntity extends Entity {
  battle: null | Battle = null;
  items: ItemAndQuantity[] = [];
  vitalBox: null | PIXI.AnimatedSprite = null;
  vitalBoxOver: null | PIXI.AnimatedSprite = null;
  vitalsTextContainer: null | PIXI.Container = null;
  currentStats: null | Record<EntityStatsKind, number> = null;
  maxStats: null | Record<EntityStatsKind, number> = null;
  lastVitalStats = {
    HP: 0,
    MP: 0,
    ATB: 0,
    FIN: 0,
  };
  hpBar: null | PIXI.Graphics = null;
  mpBar: null | PIXI.Graphics = null;
  atbBar: null | PIXI.Graphics = null;
  finaleBar: null | PIXI.Graphics = null;
  afflictions: string[] = [];
  afflictionAnimations: PIXI.AnimatedSprite[] = [];
  displayingDamageTaken = false;
  damageTakenText: null | PIXI.Text = null;
  damageTakenTextVelocity = 0;
  damageTakenFlashCount = 0;
  readyFlashDirection: "in" | "out" = "in";
  battleMenu: null | BattleMenu = null;
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

    this.addVitals();
    this.syncStats();
    this.addBattleMenu();

    if (this.isFoe) {
      this.showAnimation("walking");
    }
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

    if (this.displayingDamageTaken) {
      this.liftDamageTaken();
    }

    if (this.animations && !this.isFoe) {
      if (this.isReady && !this.isDead && !this.vitalBox?.visible) {
        this.flashReady();
      } else {
        this.animations.effects.unready();

        if (this.isReady && !this.isDead) {
          this.battleMenu?.show();
        }
      }
    }
  }

  private syncStats() {
    const stats = this.currentStats;

    if (stats) {
      this.lastVitalStats.HP = stats.HP;
      this.lastVitalStats.MP = stats.MP;
      this.lastVitalStats.ATB = stats.ATB;
      this.lastVitalStats.FIN = stats.FIN;

      this.addHPBar();
      this.addMPBar();
      this.addATBBar();
      this.addFINBar();
    }
  }

  public attack(target: BattleEntity) {
    this.currentStats!.ATB = 0;
    this.isRecovering = false;
    const attack = this.showAnimation("attacking");
    attack.loop = false;
    this.perform("attacking", 2500, () => {
      target.damageBy(10);
      this.isRecovering = true;
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

  public cast(skill: SkillKind, target: BattleEntity) {
    const skillEntry = skills[skill] as Skill;

    if (this.currentStats!.MP >= skillEntry.cost) {
      this.currentStats!.ATB = 0;
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

                // Use method to gauge strength algorithm.
                target.damageBy(2000);

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
    this.currentStats!.ATB = 0;
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

  public damageBy(amount: number) {
    if (!this.isDead) {
      const stats = this.currentStats!;
      let hpAfterAttack = Math.max(stats.HP - amount, 0);
      hpAfterAttack = Math.min(hpAfterAttack, this.maxStats!.HP);
      stats.HP = hpAfterAttack;

      this.displayDamageTaken(amount);
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

  public recoverHP(amount: number) {
    if (!this.isDead) {
      this.damageBy(-amount);
    }
  }

  public recoverMP(amount: number) {
    if (!this.isDead) {
      this.lowerMPBy(-amount);
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

  private addVitals() {
    if (this.container) {
      this.vitalBox = loadExtraAnimation("vitals");
      this.vitalBox.position.x += 32;
      this.vitalBox.position.y -= 38;
      this.container.addChildAt(this.vitalBox, 0);

      this.vitalBoxOver = loadExtraAnimation("vitals-over");
      this.vitalBoxOver.position.x += 32;
      this.vitalBoxOver.position.y -= 38;
      this.vitalBoxOver.interactive = true;

      this.container.addChild(this.vitalBoxOver);

      this.vitalBox.play();
      this.vitalBoxOver.play();
      this.vitalBox.visible = false;
      this.vitalBoxOver.visible = false;

      this.container.interactive = true;
      this.container.buttonMode = true;
      this.container.on("mousedown", () => setTimeout(this.showVitals));
      this.container.on("touchstart", () => setTimeout(this.showVitals));

      setTimeout(this.addVitalsText.bind(this));
    }
  }

  private addHPBar() {
    if (this.hpBar) {
      this.hpBar.clear();
      this.vitalBox!.removeChild(this.hpBar);
    }

    this.hpBar = new PIXI.Graphics();

    const maxHP = this.baseStats!.HP[1];
    const percent = this.lastVitalStats.HP / maxHP;

    this.hpBar.beginFill(colors.hp);
    this.hpBar.drawRect(
      config.ENTITY_VITAL_BAR_X_OFFSET,
      config.ENTITY_VITAL_BAR_Y_OFFSET,
      config.ENTITY_VITAL_BAR_WIDTH * percent,
      config.ENTITY_VITAL_BAR_HEIGHT
    );
    this.hpBar.endFill();
    this.vitalBox!.addChild(this.hpBar);
  }

  private addMPBar() {
    if (this.mpBar) {
      this.mpBar.clear();
      this.vitalBox!.removeChild(this.mpBar);
    }

    this.mpBar = new PIXI.Graphics();

    const maxMP = this.baseStats!.MP[1];
    const percent = this.lastVitalStats.MP / maxMP;

    this.mpBar.beginFill(colors.mp);
    this.mpBar.drawRect(
      config.ENTITY_VITAL_BAR_X_OFFSET,
      config.ENTITY_VITAL_BAR_Y_OFFSET + config.ENTITY_VITAL_BAR_Y_DISTANCE * 1,
      config.ENTITY_VITAL_BAR_WIDTH * percent,
      config.ENTITY_VITAL_BAR_HEIGHT
    );
    this.mpBar.endFill();
    this.vitalBox!.addChild(this.mpBar);
  }

  private addATBBar() {
    if (this.atbBar) {
      this.atbBar.clear();
      this.vitalBox!.removeChild(this.atbBar);
    }

    this.atbBar = new PIXI.Graphics();

    const percent = this.lastVitalStats.ATB / 100;
    const color = this.isReady ? colors.yellow : colors.atb;

    this.atbBar.beginFill(color);
    this.atbBar.drawRect(
      config.ENTITY_VITAL_BAR_X_OFFSET,
      config.ENTITY_VITAL_BAR_Y_OFFSET + config.ENTITY_VITAL_BAR_Y_DISTANCE * 2,
      config.ENTITY_VITAL_BAR_WIDTH * percent,
      config.ENTITY_ATB_BAR_HEIGHT
    );
    this.atbBar.endFill();
    this.vitalBox!.addChild(this.atbBar);
  }

  private addFINBar() {
    if (this.finaleBar) {
      this.finaleBar.clear();
      this.vitalBox!.removeChild(this.finaleBar);
    }

    this.finaleBar = new PIXI.Graphics();

    const percent = this.lastVitalStats.FIN / 100;
    const height = Math.min(
      config.ENTITY_FINALE_BAR_HEIGHT * percent,
      config.ENTITY_FINALE_BAR_HEIGHT
    );
    const distance = config.ENTITY_FINALE_BAR_HEIGHT - height;
    const color =
      percent === 1
        ? CHANCE.pickone([colors.red, colors.yellow, colors.blue])
        : colors.fin;

    this.finaleBar.beginFill(color);
    this.finaleBar.drawRect(
      config.ENTITY_VITAL_BAR_X_OFFSET + config.ENTITY_VITAL_BAR_WIDTH + 1,
      config.ENTITY_FINALE_BAR_HEIGHT + distance,
      config.ENTITY_FINALE_BAR_WIDTH,
      height
    );
    this.finaleBar.endFill();
    this.vitalBox!.addChild(this.finaleBar);
  }

  private addVitalsText() {
    if (this.container) {
      this.vitalsTextContainer = new PIXI.Container();
      this.vitalsTextContainer.name = "Vital Text";
      this.vitalsTextContainer.visible = false;
      this.container.addChild(this.vitalsTextContainer);

      this.vitalsTextContainer.position.set(66, 110);

      const stage = new PIXI.Text(this.stage.toString(), {
        ...basicTextStyle,
        strokeThickness: 3,
        fontWeight: "bolder",
        fontSize: 40,
        dropShadow: false,
      });
      this.vitalsTextContainer.addChild(stage);

      const shortened = this.isFoe
        ? this.goesBy
        : this.goesBy
            .split(" ")
            .map((each, i) => (i === 0 ? `${each[0]}.` : each))
            .join(" ");
      const goesBy = new PIXI.Text(shortened.toUpperCase(), {
        ...basicTextStyle,
        fontSize: 16,
        fontWeight: "600",
        fill: colors.white,
        stroke: colors.black,
        strokeThickness: 3,
        letterSpacing: 0.2,
        dropShadow: false,
      });
      goesBy.position.x += 66;
      goesBy.position.y += 5;
      this.vitalsTextContainer.addChild(goesBy);

      if (this.isFoe) {
        for (const container of [this.vitalBox, this.vitalBoxOver]) {
          if (container) {
            container.scale.x *= -1;
            container.position.x += 460;
          }
        }

        this.vitalsTextContainer.scale.x *= -1;
        this.vitalsTextContainer.position.x += 390;
      } else {
        const job = new PIXI.Text(this.name.toUpperCase(), {
          ...basicTextStyle,
          fontSize: 12,
          fontWeight: "bolder",
          fill: colors.white,
          stroke: colors.black,
          strokeThickness: 3,
          letterSpacing: 0.1,
          dropShadow: false,
        });
        job.position.x += 66;
        job.position.y += 36;
        this.vitalsTextContainer.addChild(job);
      }
    }
  }

  private addBattleMenu() {
    if (this.container && this.battle) {
      this.battleMenu = new BattleMenu(
        this.screen,
        this,
        this.battle,
        this.items,
        () => setTimeout(this.hideVitals.bind(this), 250)
      );
      this.container.addChild(this.battleMenu.wrapper);
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

      if (this.isFoe) {
        this.damageTakenText.anchor.y = 1;
        this.damageTakenText.position.y *= -1;
      }

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

  private showVitals = () => {
    if (
      this.container &&
      this.animations &&
      this.vitalBox &&
      this.vitalBoxOver &&
      this.vitalsTextContainer &&
      this.battleMenu
    ) {
      this.vitalBox.visible = true;
      this.vitalBoxOver.visible = true;
      this.vitalsTextContainer.visible = true;

      if (!this.isFoe && this.isReady) {
        this.battleMenu.show();
      }

      this.screen.interactive = true;
      this.screen.on("mousedown", this.hideVitals);
      this.screen.on("touchstart", this.hideVitals);
    }
  };

  private hideVitals = () => {
    if (
      this.animations &&
      this.container &&
      this.vitalBox &&
      this.vitalBoxOver &&
      this.vitalsTextContainer &&
      this.battleMenu
    ) {
      this.vitalBox.visible = false;
      this.vitalBoxOver.visible = false;
      this.vitalsTextContainer.visible = false;

      if (!this.isFoe) {
        this.battleMenu.hide();
      }

      this.screen.interactive = false;
      this.screen.off("mousedown", this.hideVitals);
      this.screen.off("touchstart", this.hideVitals);
    }
  };

  private flashReady() {
    if (this.animations && !this.isFoe) {
      if (this.readyFlashDirection === "in") {
        const isFullyIn =
          this.animations.effects.ready(
            config.ENTITY_READY_FLASH_SPEED,
            this.hasFinaleReady
          ) >= 0.7;

        if (isFullyIn) {
          this.readyFlashDirection = "out";
        }
      } else {
        const isFullyOut =
          this.animations.effects.ready(
            -config.ENTITY_READY_FLASH_SPEED,
            this.hasFinaleReady
          ) === 0;

        if (isFullyOut) {
          this.readyFlashDirection = "in";
        }
      }
    }
  }
}

export class FriendEntity extends BattleEntity {
  public constructor(_name: EntityKind, _screen: PIXI.Container) {
    super(_name, _screen, "friend", loadJobAnimations);
  }
}

export class FoeEntity extends BattleEntity {
  public constructor(_name: EntityKind, _screen: PIXI.Container) {
    super(_name, _screen, "foe", loadFoeAnimations);
  }
}
