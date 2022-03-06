import * as PIXI from "pixi.js";
import { observable, observe } from "mobx";
import Chance from "chance";
import { foes, Foe, FoeKind } from "../foes";
import {
  contain,
  loadFoeAnimations,
  loadJobAnimations,
  keyboard,
  KeyboardHandler,
  EntityAnimations,
  hitTestRectangle,
} from "../../common";
import { Job, JobKind, jobs } from "../jobs";
import type { GameState, GameChangers } from "../../App";

const CHANCE = new Chance();
const keyboardHandlers: KeyboardHandler[] = [];
let gameChangersRef: GameChangers;
let screenRef: PIXI.Container;

export const fightEnterScript = (
  gameState: GameState,
  gameChangers: GameChangers
) => {
  gameChangersRef = gameChangers;

  gameChangers.changeActions(["profile", "party", "stuff"]);

  observe(battleState, () => {
    gameChangers.changeFight(battleState);
  });

  const screen = gameState.getScreen();

  if (screen) {
    registerEntities(screen);
    registerKeys();
    screenRef = screen;
  }

  PIXI.Ticker.shared.add(gameLoop);
};

export const fightExitScript = (
  gameState: GameState,
  gameChangers: GameChangers
) => {
  cleanupBattleData();
};

type BattleAction = {
  who: FoeWithAnimations | HeroWithAnimations;
  what: string;
};
type FoeWithAnimations = Foe & EntityAnimations & { guid: string };
type HeroWithAnimations = Job & EntityAnimations & { guid: string };
type Entity = FoeWithAnimations | HeroWithAnimations;
type TrackedEntity = {
  vx: number;
  vy: number;
  func(): void;
};
type NormalizedEntities = {
  ids: string[];
  byId: Record<string, Entity>;
};

const initBattleState = () => ({
  frames: 0,
  time: 0,
  foes: [] as FoeWithAnimations[],
  heroes: [] as HeroWithAnimations[],
  actionQueue: [] as BattleAction[],
  processingAction: false,
  entities: {
    ids: [],
    byId: {},
  } as NormalizedEntities,
});

let battleState = observable(initBattleState());

const getBattleState = () => battleState;

export type BattleState = typeof battleState;

(window as any).checkBattleState = () => battleState;

const tracker = new Map<string, TrackedEntity>();
const gameLoop = () => {
  battleState.frames++;
  battleState.time = battleState.frames / 60;

  // Invalid state.
  if (battleState.foes.length === 0) {
    throw new Error();
  } else if (battleState.heroes.length === 0) {
    throw new Error();
  } else if (!gameChangersRef) {
    throw new Error();
  }

  if (!heroesRemain()) {
    // Battle: lost.
    console.info("Battle lost!");
    cleanupBattleData();
  } else if (!foesRemain()) {
    // Battle: won.
    console.info("Battle won!");
    cleanupBattleData();
  } else {
    // Battle is ongoing.
    // Foes gain ATB.
    for (const foe of battleState.foes) {
      if (isAlive(foe)) {
        if (isReady(foe) && !isQueued(foe)) {
          queueEntityAction(foe, "attack");
        } else if (!isQueued(foe)) {
          increaseAtb(foe);
        }
      }
    }

    // Heroes gain ATB.
    for (const hero of battleState.heroes) {
      if (isAlive(hero)) {
        if (isReady(hero) && !isQueued(hero)) {
          // Hero ready.
        } else {
          increaseAtb(hero);
        }
      }
    }

    // Process action queue.
    if (!battleState.processingAction) {
      const nextInQueue = battleState.actionQueue.shift();
      if (nextInQueue) {
        const { who, what } = nextInQueue;

        battleState.processingAction = true;

        resetAtb(who);

        let initialTime = battleState.time;
        const tag = `${who.guid}/move`;
        const walkForward = () => {
          tracker.set(tag, {
            vx: CHANCE.integer({ min: 0, max: 3 }),
            vy: CHANCE.integer({ min: 0, max: 3 }),
            func: () => {
              const elapsedTime = battleState.time - initialTime;

              if (elapsedTime > 1) {
                initialTime = battleState.time;
                tracker.delete(who.guid);
                walkBackward();
              }
            },
          });
        };
        const walkBackward = () => {
          gameChangersRef.changeDialogue([]);

          tracker.set(tag, {
            vx: -CHANCE.integer({ min: 0, max: 3 }),
            vy: -CHANCE.integer({ min: 0, max: 3 }),
            func: () => {
              const elapsedTime = battleState.time - initialTime;

              if (elapsedTime > 1) {
                tracker.delete(who.guid);
                battleState.processingAction = false;
              }
            },
          });
        };

        walkForward();
      }
    }

    // Process motion tracking.
    for (const entity of (battleState.foes as Entity[]).concat(
      battleState.heroes
    )) {
      const isFoe = battleState.foes.includes(entity as FoeWithAnimations);

      for (const handler of ["focus", "move"]) {
        const tag = `${entity.guid}/${handler}`;

        if (tracker.has(tag)) {
          const { vx, vy, func } = tracker.get(tag)!;
          entity.container.position.x += vx;
          entity.container.position.y += vy;
          func();

          // Contain to boundaries.
          if (isFoe && screenRef) {
            const entityCollision = contain(entity.container as any, screenRef);

            if (["left", "right"].includes(entityCollision ?? "")) {
              tracker.set(tag, {
                vx: 0,
                vy: vy,
                func,
              });
            }

            if (["up", "down"].includes(entityCollision ?? "")) {
              tracker.set(tag, {
                vx: vx,
                vy: 0,
                func,
              });
            }

            // Handle collision with other foes.
            const otherFoes = battleState.foes.filter(
              (foe) => foe.guid !== entity.guid
            );
            for (const foe of otherFoes) {
              if (hitTestRectangle(entity.container, foe.container)) {
                tracker.set(tag, {
                  vx: -vx,
                  vy: -vy,
                  func,
                });
              }
            }

            // Foes grow larger when closer to the party.
            const verticalDistance = entity.container.y;
            const fullDistance = screenRef.height;
            const distancePercent = verticalDistance / fullDistance;

            entity.container.scale.set(1 + distancePercent * 2);
          }
        }
      }
    }
  }
};

// #region Helpers

const cleanupBattleData = () => {
  PIXI.Ticker.shared.remove(gameLoop);

  for (const keyboardHandler of keyboardHandlers) {
    keyboardHandler.unsubscribe();
  }

  battleState = initBattleState();
};

const registerEntities = (screen: PIXI.Container) => {
  // Foes
  const foesToFight = makeFoesToFight() as FoeWithAnimations[];
  const foeContainer = new PIXI.Container();
  screen.addChild(foeContainer);
  foeContainer.name = "Foe Container";

  for (let i = 0; i < foesToFight.length; i++) {
    const foe = foesToFight[i];
    foeContainer.addChild(foe.container);
    foe.container.position.x += i * foe.container.height;
    foe.container.interactive = true;
    foe.container.buttonMode = true;
  }

  registerFoes(foesToFight);

  // Heroes
  const heroes = makeHeroesToFight() as HeroWithAnimations[];
  const heroContainer = new PIXI.Container();
  screen.addChild(heroContainer);
  heroContainer.position.set(0, 380);
  heroContainer.name = "Hero Container";

  registerHeroes(heroes);

  for (const entity of (foesToFight as Entity[]).concat(heroes)) {
    battleState.entities.ids.push(entity.guid);
    battleState.entities.byId[entity.guid] = entity;
  }

  for (let i = 0; i < heroes.length; i++) {
    const hero = heroes[i];
    heroContainer.addChild(hero.container);
    hero.container.scale.set(2, 3);
    hero.container.position.x += (i * hero.container.width) / 1.33;
    hero.container.interactive = true;
    hero.container.buttonMode = true;
    const blur = new PIXI.filters.BlurFilter();
    hero.container.filters = [blur];

    let initialTime = battleState.time;
    const initialX = hero.container.position.x;
    const initialY = hero.container.position.y;
    const tag = `${hero.guid}/focus`;
    const handlers = {
      focus: () => {
        blur.enabled = false;

        tracker.set(tag, {
          vx: 0,
          vy: -2,
          func: () => {
            const state = getBattleState();
            const elapsedTime = state.time - initialTime;

            if (elapsedTime > 1) {
              initialTime = state.time;
              tracker.delete(tag);
            }
          },
        });
      },
      blur: () => {
        blur.enabled = true;
        tracker.delete(tag);
        hero.container.position.set(initialX, initialY);
        initialTime = getBattleState().time;
      },
    };

    hero.container.on("mouseover", handlers.focus);
    hero.container.on("touchstart", handlers.focus);
    hero.container.on("mouseout", handlers.blur);
    hero.container.on("touchend", handlers.blur);
  }
};

const registerKeys = () => {
  // Keys
  const [up, left, down, right] = ["w", "a", "s", "d"].map(keyboard);
  keyboardHandlers.push(up, left, down, right);

  up.press = () => {
    console.log("Up.");
  };
  left.press = () => {
    console.log("Left.");
  };
  down.press = () => {
    console.log("Down.");
  };
  right.press = () => {
    console.log("Right");
  };
};

// Changers
const registerFoes = (foes: FoeWithAnimations[]) => (battleState.foes = foes);
const registerHeroes = (heroes: HeroWithAnimations[]) =>
  (battleState.heroes = heroes);
const queueEntityAction = (entity: Entity, action: string) =>
  battleState.actionQueue.push({ who: entity, what: action });
const increaseAtb = (entity: Entity) => {
  const nextAtb = Math.min(entity.stats.ATB + 0.2, 100);
  entity.stats.ATB = nextAtb;
};
const resetAtb = (entity: Entity) => (entity.stats.ATB = 0);

// Selectors
const foesRemain = () => battleState.foes.some((foe) => foe.stats.HP[0] > 0);
const heroesRemain = () =>
  battleState.heroes.some((hero) => hero.stats.HP[0] > 0);
const isQueued = (entity: FoeWithAnimations | HeroWithAnimations) =>
  battleState.actionQueue.some((action) => action.who === entity);
const isAlive = (entity: FoeWithAnimations | HeroWithAnimations) =>
  entity.stats.HP[0] > 0;
const isReady = (entity: FoeWithAnimations | HeroWithAnimations) =>
  entity.stats.ATB === 100;

const makeFoesToFight = () =>
  Array.from({ length: CHANCE.integer({ min: 1, max: 3 }) }, () =>
    CHANCE.pickone(Object.keys(foes))
  ).map((foeKind) => {
    const foe = foes[foeKind as FoeKind];
    const animations = loadFoeAnimations(foeKind as FoeKind);

    return {
      ...foe,
      animations: animations.animations,
      container: animations.container,
      effects: animations.effects,
      guid: CHANCE.guid(),
    };
  });

const makeHeroesToFight = () =>
  Array.from({ length: CHANCE.integer({ min: 1, max: 3 }) }, () =>
    CHANCE.pickone(Object.keys(jobs))
  ).map((jobKind) => {
    const hero = jobs[jobKind as JobKind];
    const animations = loadJobAnimations(jobKind as JobKind);

    return {
      ...hero,
      animations: animations.animations,
      container: animations.container,
      effects: animations.effects,
      guid: CHANCE.guid(),
    };
  });
// #endregion
