import * as PIXI from "pixi.js";
import Chance from "chance";
import {
  EntityAnimations,
  EntityAnimationLoader,
  colors,
  config,
  loadJobAnimations,
  loadAfflictionAnimation,
  basicTextStyle,
  loadSkillAnimation,
  getRomanNumeralFor,
  loadFoeAnimations,
  loadCastingAnimations,
  loadExtraAnimation,
} from "../common";
import {
  AfflictionKind,
  entities,
  EntityKind,
  EntityStats,
  SkillKind,
  skills,
  Skill,
  FoeKind,
} from "../data";
import { BattleMessage, InteractiveMessage } from "./Message";
import { ScreenMessage } from ".";
import { ENTITY_VITAL_BAR_WIDTH, ENTITY_VITAL_BAR_X_OFFSET } from "../common/config";

const CHANCE = new Chance();
const ticker = PIXI.Ticker.shared;

export type EntityStatsKind = keyof EntityStats;

export class Entity {
  id = CHANCE.guid();
  name: EntityKind;
  goesBy = CHANCE.name();
  screen: PIXI.Container;
  stage = 1;
  loader: EntityAnimationLoader;
  loaded = false;
  container: null | PIXI.Container = null;
  animations: null | EntityAnimations = null;
  baseStats: null | EntityStats = null;
  currentStats: null | Record<EntityStatsKind, number> = null;
  maxStats: null | Record<EntityStatsKind, number> = null;
  baseSkills: SkillKind[] = [];
  meandering = false;
  shouldStopMeandering = false;

  // Sprite Effects
  castShadow: null | PIXI.Graphics = null;

  // Afflictions
  afflictions: string[] = [];
  afflictionAnimations: PIXI.AnimatedSprite[] = [];

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

  constructor(
    _name: EntityKind,
    _screen: PIXI.Container,
    _loader: EntityAnimationLoader
  ) {
    this.name = _name;
    this.screen = _screen;
    this.loader = _loader;
  }

  // Public
  public get isDead() {
    return Boolean(this.currentStats?.HP === 0);
  }

  public async load() {
    this.animations = this.loader(this.name);

    ticker.add(this.update.bind(this));

    this.container = this.animations!.container;

    this.addShadow();

    // Add Stats
    const { stats } = entities[this.name];
    this.baseStats = stats;
    this.currentStats = this.maxStats = Object.entries(stats).reduce(
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
    this.maxStats.ATB = 100;

    // Add Skills
    for (const skillName of entities[this.name].skills) {
      const skill = skills[skillName];

      if (skill) {
        this.baseSkills.push(skillName);
      } else {
        throw new Error(`Invalid skill ${skillName} missing entry.`);
      }
    }

    this.loaded = true;
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

  public cast(skill: SkillKind, target: Entity) {
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
          // target.targettedAura!.visible = true;
          // target.targettedOverlay!.visible = true;

          const skillEntry = skills[skill] as Skill;
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
              target.damageBy(10);

              if (skillEntry.affliction) {
                const [affliction, chanceToInflict] = skillEntry.affliction;
                const willInflict = CHANCE.bool({
                  likelihood: chanceToInflict,
                });

                if (willInflict) {
                  target.inflict(affliction);
                }
              }
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

  public stopMeandering() {
    this.shouldStopMeandering = true;
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
      this.castShadow.width = config.CAST_SHADOW_WIDTH_UP * config.ENTITY_SCALE;
    }
  }

  private showAnimation(animation: keyof Omit<EntityAnimations, "container">) {
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
        this.castShadow.width =
          config.CAST_SHADOW_WIDTH_DOWN * config.ENTITY_SCALE;
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
      if (this.shouldStopMeandering) {
        this.stopMeandering();
        this.meandering = false;
        this.shouldStopMeandering = false;
      } else {
        this.startMeandering();
      }
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
      for (const effect of [this.castShadow]) {
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

  private addShadow() {
    if (this.container) {
      const circle = this.addEffect(colors.grey, PIXI.BLEND_MODES.MULTIPLY);
      circle.alpha = 0.75;
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
    animation: keyof Omit<EntityAnimations, "container">,
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

// === Player ===
export class PlayableEntity extends Entity {
  constructor(_name: EntityKind, _screen: PIXI.Container) {
    super(_name, _screen, loadJobAnimations);
  }
}

export class PubEntity extends PlayableEntity {
  controller: ScreenMessage;

  constructor(
    _name: EntityKind,
    _screen: PIXI.Container,
    _controller: ScreenMessage
  ) {
    super(_name, _screen);
    this.controller = _controller;
  }

  public async load() {
    super.load();

    if (this.container) {
      const handleInteraction = () => {
        if (this.container) {
          const message = new InteractiveMessage(
            `${this.goesBy},\n\t\t${CHANCE.capitalize(
              this.name
            )} ${getRomanNumeralFor(this.stage)}`
          );
          message.container.position.set(64, -128); // FIXME
          this.container.addChild(message.container);

          const removeMessage = () => {
            if (this.container) {
              this.container.removeChild(message.container);

              message.container.destroy();

              this.screen.interactive = false; // FIXME
              this.screen.removeListener("mousedown", removeMessage);
              this.screen.removeListener("touchstart", removeMessage);
              this.container.on("mousedown", handleInteraction);
              this.container.on("touchstart", handleInteraction);

              this.controller.clear();
              this.meander();
            }
          };

          this.screen.interactive = true;
          this.screen.on("mousedown", removeMessage);
          this.screen.on("touchstart", removeMessage);

          message.addActions({
            title: "Chat",
            onInteraction: (event) => {
              event.stopPropagation();
              this.handleChat();
            },
          });
        }
      };

      this.container.cursor = "pointer";
      this.container.interactive = true;
      this.container.on("mousedown", handleInteraction);
      this.container.on("touchstart", handleInteraction);
    }
  }

  private handleChat = () => {
    const stuff = CHANCE.sentence({ words: 4 }).split(". ").join(".\n");
    this.stopMeandering();
    this.controller.change(stuff);
  };
}

export class BattleEntity extends PlayableEntity {
  vitalBox: null | PIXI.AnimatedSprite = null;
  vitalBoxOver: null | PIXI.AnimatedSprite = null;

  // Stats
  hpBar: null | PIXI.Graphics = null;
  mpBar: null | PIXI.Graphics = null;
  atbBar: null | PIXI.Graphics = null;
  finaleBar: null | PIXI.Graphics = null;

  // Display HP, MP, ATB, Finale, etc
  public async load() {
    await super.load();

    const container = this.container!;
    this.vitalBox = loadExtraAnimation("vitals");
    this.vitalBox.position.x += 32;
    this.vitalBox.position.y -= 38;
    container.addChildAt(this.vitalBox, 0);

    this.vitalBoxOver = loadExtraAnimation("vitals-over");
    this.vitalBoxOver.position.x += 32;
    this.vitalBoxOver.position.y -= 38;
    container.addChild(this.vitalBoxOver);

    this.vitalBox.play();
    this.vitalBoxOver.play();
    this.vitalBox.visible = false;
    this.vitalBoxOver.visible = false;

    container.interactive = true;
    container.cursor = "pointer";

    container.on("mousedown", this.showVitals);
    container.on("touchstart", this.showVitals);

    this.addHPBar();
    this.addMPBar();
    this.addATBBar();
    this.addFinaleBar();
  }

  // A D D
  private addHPBar() {
    const hadHpBar = Boolean(this.hpBar);

    if (this.hpBar) {
      this.hpBar.clear();
    } else {
      this.hpBar = new PIXI.Graphics()
    }

    const { HP } = this.currentStats!;
    const { HP: maxHP } = this.maxStats!;
    const percent = HP / maxHP;
    
    this.hpBar.beginFill(colors.red);
    this.hpBar.drawRect(
      config.ENTITY_VITAL_BAR_X_OFFSET,
      config.ENTITY_VITAL_BAR_Y_OFFSET,
      config.ENTITY_VITAL_BAR_WIDTH * percent,
      config.ENTITY_VITAL_BAR_HEIGHT
    );
    this.hpBar.endFill();
    
    if (!hadHpBar) {
      this.vitalBox!.addChild(this.hpBar);
    }
  }

  private addMPBar() {
    const mpBar = (this.mpBar = new PIXI.Graphics());
    mpBar.beginFill(colors.mp);
    mpBar.drawRect(
      config.ENTITY_VITAL_BAR_X_OFFSET,
      config.ENTITY_VITAL_BAR_Y_OFFSET + config.ENTITY_VITAL_BAR_Y_DISTANCE * 1,
      config.ENTITY_VITAL_BAR_WIDTH,
      config.ENTITY_VITAL_BAR_HEIGHT
    );
    mpBar.endFill();

    this.vitalBoxOver!.addChild(mpBar);
  }

  private addATBBar() {
    const atbBar = (this.atbBar = new PIXI.Graphics());
    atbBar.beginFill(colors.atb);
    atbBar.drawRect(
      config.ENTITY_VITAL_BAR_X_OFFSET,
      config.ENTITY_VITAL_BAR_Y_OFFSET + config.ENTITY_VITAL_BAR_Y_DISTANCE * 2,
      config.ENTITY_VITAL_BAR_WIDTH,
      config.ENTITY_ATB_BAR_HEIGHT
    );
    atbBar.endFill();

    this.vitalBoxOver!.addChild(atbBar);
  }

  private addFinaleBar() {
    const finaleBar = (this.finaleBar = new PIXI.Graphics());
    finaleBar.beginFill(colors.finale);
    finaleBar.drawRect(
      config.ENTITY_VITAL_BAR_X_OFFSET + config.ENTITY_VITAL_BAR_WIDTH + 1,
      config.ENTITY_FINALE_BAR_HEIGHT,
      config.ENTITY_FINALE_BAR_WIDTH,
      config.ENTITY_FINALE_BAR_HEIGHT
    );
    finaleBar.endFill();

    this.vitalBoxOver!.addChild(finaleBar);
  }

  // U P D A T E
  private updateMPBar() {}

  private updateATBBar() {}

  private updateFinaleBar() {}

  // V I T A L S
  private showVitals = () => {
    if (
      this.container &&
      this.animations &&
      this.vitalBox &&
      this.vitalBoxOver
    ) {
      this.vitalBox.visible = true;
      this.vitalBoxOver.visible = true;

      this.container.parent.parent.interactive = true;
      this.container.parent.parent.on("mousedown", this.hideVitals);
      this.container.parent.parent.on("touchstart", this.hideVitals);
    }
  };

  private hideVitals = () => {
    if (
      this.animations &&
      this.container &&
      this.vitalBox &&
      this.vitalBoxOver
    ) {
      this.vitalBox.visible = false;
      this.vitalBoxOver.visible = false;

      this.container.parent.parent.interactive = false;
      this.container.parent.parent.off("mousedown", this.hideVitals);
      this.container.parent.parent.off("touchstart", this.hideVitals);
    }
  };
}

// === Foe ===
export class FoeEntity extends Entity {
  constructor(_name: FoeKind, _screen: PIXI.Container) {
    super(_name, _screen, loadFoeAnimations);
  }
}
