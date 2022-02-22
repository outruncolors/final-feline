import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";
import Chance from "chance";
import { config, loadLocationSprite } from "../common";
import { Location, LocationKind, JobKind, jobs, locations } from "../data";
import { BattleEntity } from "./Entity";

const CHANCE = new Chance();

export class Battle {
  container: PIXI.Container;
  location: Location;
  screen: PIXI.Container;
  playableParty: BattleEntity[];

  constructor(
    _location: LocationKind,
    _screen: PIXI.Container,
    _playableParty: BattleEntity[]
  ) {
    this.location = (locations as Record<LocationKind, Location>)[_location];
    this.screen = _screen;
    this.playableParty = _playableParty;
    this.container = new PIXI.Container();
  }

  public async load() {
    this.displayBackground();
    this.playBackgroundMusic();
    await this.loadAnimations();
  }

  private async loadAnimations() {
    const leftSide = new PIXI.Container();

    for (let i = 0; i < this.playableParty.length; i++) {
      const entity = this.playableParty[i];
      await entity.load();
      entity.container!.position.y += config.BATTLE_TOP_MARGIN + i * config.BATTLE_CHARACTER_SEPARATION * config.ENTITY_SCALE;
      leftSide.addChild(entity.container!);
    }

    this.container.addChild(leftSide);
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
    const playableParty: BattleEntity[] = [
      new BattleEntity(CHANCE.pickone(Object.keys(jobs) as JobKind[]), _screen),
      new BattleEntity(CHANCE.pickone(Object.keys(jobs) as JobKind[]), _screen),
    ];

    super(randomLocation, _screen, playableParty);
  }
}
