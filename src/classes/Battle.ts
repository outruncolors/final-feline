import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";
import Chance from "chance";
import { colors, config, sleep } from "../common";
import { JobKind, ItemKind, FoeKind, foes, jobs } from "../data";
import { BattleEntity, FriendEntity, FoeEntity } from "./Entity";
import { Message } from "./Message";
import { ScreenFader } from "./ScreenFader";

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
const ticker = PIXI.Ticker.shared;

export class Battle {
  container: PIXI.Container;
  screen: PIXI.Container;
  usableItems: ItemAndQuantity[];
  playableParty: BattleEntity[];
  foes: BattleEntity[];
  status: BattleStatus;
  inProgress = true;
  framesSinceEnd = 0;
  won = false;
  escaped = false;

  constructor(
    _screen: PIXI.Container,
    _usableItems: ItemAndQuantity[],
    _playableParty: BattleEntity[],
    _foes: BattleEntity[]
  ) {
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
    this.playBackgroundMusic();

    await Promise.all([this.loadAnimations()]);

    ticker.add(this.update.bind(this));

    await ScreenFader.fadeIn(this.screen);
  }

  public update() {
    if (this.inProgress) {
      const someoneIsAlive = this.playableParty.some(
        (member) => !member.isDead
      );

      if (!someoneIsAlive) {
        this.inProgress = false;
        this.handlePlayerLost();
      }

      const enemyIsAlive = this.foes.some((foe) => !foe.isDead);

      if (!enemyIsAlive) {
        this.inProgress = false;
        this.handlePlayerWon();
      }
    } else if (this.framesSinceEnd >= config.SCREEN_FADE_DELAY_IN_FRAMES) {
      this.showOutcomeScreen();
    } else {
      this.framesSinceEnd++;
    }
  }

  private async handlePlayerLost() {
    if (ScreenFader.shared.children.length > 0) {
      const [fader] = ScreenFader.shared.children as PIXI.Sprite[];
      fader.tint = colors.red;
    }
  }

  private async handlePlayerWon() {
    if (ScreenFader.shared.children.length > 0) {
      const [fader] = ScreenFader.shared.children as PIXI.Sprite[];
      fader.tint = colors.blue;
    }
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

  private async playBackgroundMusic() {
    sound.add("battle", "/assets/sounds/battle.wav");
    sound.play("battle", {
      volume: 0.3,
      loop: true,
    });
  }

  private async showOutcomeScreen() {
    await ScreenFader.fadeOut(this.screen);
    const message = new Message("Testing one two");
    this.screen.removeChildren();
    await sleep(2000);
    await ScreenFader.fadeIn(this.screen);
    this.screen.addChild(message.container);
  }
}

export class RandomBattle extends Battle {
  constructor(_screen: PIXI.Container) {
    const [a, c] = [
      new FriendEntity(CHANCE.pickone(Object.keys(jobs) as JobKind[]), _screen),
      new FoeEntity(CHANCE.pickone(Object.keys(foes) as FoeKind[]), _screen),
    ];
    const playableParty: FriendEntity[] = [a];
    const foeParty: FoeEntity[] = [c];
    const usableItems: ItemAndQuantity[] = [
      ["fapple", 1],
      ["rich-bitch-juice", 1],
    ];

    super(_screen, usableItems, playableParty, foeParty);

    a.register(this, usableItems);
    c.register(this, []);
  }
}
