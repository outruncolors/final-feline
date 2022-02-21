import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";
import Chance from "chance";
import { loadLocationSprite } from "../common";
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
    for (const entity of this.playableParty) {
      await entity.load();

      this.container.addChild(entity.container!);
    }

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
    ];

    super(randomLocation, _screen, playableParty);
  }
}
