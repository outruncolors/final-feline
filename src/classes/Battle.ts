import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";
import Chance from "chance";
import { config, loadLocationSprite } from "../common";
import {
  Location,
  LocationKind,
  JobKind,
  ItemKind,
  items,
  jobs,
  locations,
} from "../data";
import { BattleEntity } from "./Entity";

export interface BattleStatus {
  left: BattleSide;
  right: BattleSide;
  queue: BattleEntity[];
}

export interface BattleSide {
  team: BattleEntity[];
  items: ItemAndQuantity[];
}

export type ItemAndQuantity = [ItemKind, number];

const CHANCE = new Chance();

export class Battle {
  container: PIXI.Container;
  location: Location;
  screen: PIXI.Container;
  usableItems: ItemAndQuantity[];
  playableParty: BattleEntity[];
  foes: BattleEntity[];
  status: BattleStatus;

  constructor(
    _location: LocationKind,
    _screen: PIXI.Container,
    _usableItems: ItemAndQuantity[],
    _playableParty: BattleEntity[],
    _foes: BattleEntity[]
  ) {
    this.location = (locations as Record<LocationKind, Location>)[_location];
    this.screen = _screen;
    this.usableItems = _usableItems;
    this.playableParty = _playableParty;
    this.foes = _foes;
    this.container = new PIXI.Container();
    this.status = {
      left: {
        team: this.playableParty,
        items: this.usableItems,
      },
      right: {
        team: this.foes,
        items: [],
      },
      queue: [],
    };
  }

  public async load() {
    this.displayBackground();
    this.playBackgroundMusic();
    await this.loadAnimations();
  }

  private async loadAnimations() {
    const leftSide = new PIXI.Container();
    this.container.addChild(leftSide);

    for (let i = 0; i < this.playableParty.length; i++) {
      const entity = this.playableParty[i];
      await entity.load();
      entity.container!.position.y +=
        config.BATTLE_TOP_MARGIN +
        i * config.BATTLE_CHARACTER_SEPARATION * config.ENTITY_SCALE;
      leftSide.addChild(entity.container!);
    }

    this.container.addChild(leftSide);
    this.screen.addChild(this.container);

    const rightSide = new PIXI.Container();
    this.container.addChild(rightSide);

    for (let i = 0; i < this.foes.length; i++) {
      const entity = this.foes[i];
      await entity.load();
      entity.isFoe = true;

      entity.container!.position.y +=
        config.BATTLE_TOP_MARGIN +
        i * config.BATTLE_CHARACTER_SEPARATION * config.ENTITY_SCALE;
      rightSide.addChild(entity.container!);
    }

    rightSide.scale.x *= -1;
    rightSide.position.x =
      1920 - (rightSide.scale.x * rightSide.width) / 2 + rightSide.width;

    this.screen.addChild(this.container);
  }

  private displayBackground() {
    const background = loadLocationSprite(this.location.name);

    if (background) {
      this.screen.addChild(background);
    }
  }

  private async playBackgroundMusic() {
    sound.add("battle", "/assets/sounds/battle.wav");
    sound.play("battle", {
      volume: 0.66,
      loop: true,
    });
  }
}

export class RandomBattle extends Battle {
  constructor(_screen: PIXI.Container) {
    const randomLocation = CHANCE.pickone(
      Object.keys(locations) as LocationKind[]
    );

    // MOVEME
    const [a, b, c, d] = [
      new BattleEntity(CHANCE.pickone(Object.keys(jobs) as JobKind[]), _screen),
      new BattleEntity(CHANCE.pickone(Object.keys(jobs) as JobKind[]), _screen),
      new BattleEntity(
        CHANCE.pickone(Object.keys(jobs) as JobKind[]),
        _screen,
        "foe"
      ),
      new BattleEntity(
        CHANCE.pickone(Object.keys(jobs) as JobKind[]),
        _screen,
        "foe"
      ),
    ];

    const playableParty: BattleEntity[] = [a, b];
    const foes: BattleEntity[] = [c, d];
    const usableItems: ItemAndQuantity[] = [["fapple", 1], ['rich-bitch-juice', 1]];

    super("google", _screen, usableItems, playableParty, foes);

    a.register(this, usableItems);
    b.register(this, usableItems);
    c.register(this, []);
    d.register(this, []);
  }
}
