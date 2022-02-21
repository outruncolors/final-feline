import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";
import Chance from "chance";
import { loadLocationSprite } from "../common";
import { Location, LocationKind, locations } from "../data";
import { Entity } from "./Entity";

const CHANCE = new Chance();

export class Battle {
  location: Location;
  screen: PIXI.Container;
  playableParty: Entity[];

  constructor(
    _location: LocationKind,
    _screen: PIXI.Container,
    _playableParty: Entity[]
  ) {
    this.location = (locations as Record<LocationKind, Location>)[_location];
    this.screen = _screen;
    this.playableParty = _playableParty;
  }

  public async load() {
    this.displayBackground();
    this.playBackgroundMusic();
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
    const playableParty: Entity[] = [];

    super(randomLocation, _screen, playableParty);
  }
}
