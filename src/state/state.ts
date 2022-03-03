import { ReactNode } from "react";
import * as PIXI from "pixi.js";
import { makeAutoObservable } from "mobx";
import {
  AfflictionKind,
  FoeKind,
  ItemKind,
  JobKind,
  ScreenKind,
  SkillKind,
} from "../data";

export type GameState = ReturnType<typeof initState>;
export type GameStateProperty = keyof GameState;

// === config
const config = {
  SCREEN_SIZE: [1920 / 2, 1080 / 2],
};

const initState = () => {
  const [width, height] = config.SCREEN_SIZE;
  const app = new PIXI.Application({ width, height });
  const screen = new PIXI.Container();

  app.stage.addChild(screen);
  app.renderer.render(app.stage);

  return {
    app,
    ticks: 0,
    player: {
      id: "",
      name: "Foo Bar",
      stuff: [] as ItemAndQuantity[],
      party: [] as TeamMember[],
      roster: [] as TeamMember[],
      felidae: 0,
      transactions: [],
    },
    screen: {
      container: screen,
      which: null as null | ScreenKind,
      animation: null as null | string,
      width,
      height,
      fuzzing: false,
    },
    notifications: [] as Array<{ message: ReactNode; duration: number }>,
    log: [{ kind: "misc", message: "--- Start ---" }],
    dialogue: [] as Dialogue[],
  };
};

export let state = initState();

makeAutoObservable(state);

// == player
export interface GameEntity {
  name: string;
  stage: number;
  hp: [number, number];
  mp: [number, number];
  atb: number;
  fin: number;
  affliction: AfflictionKind;
  skills: SkillKind[];
}

export interface TeamMember extends GameEntity {
  job: JobKind;
}

export interface Foe extends GameEntity {
  foe: FoeKind;
}

export type ItemAndQuantity = [ItemKind, number];

export interface Dialogue {
  name: string;
  avatar: string;
  text: string;
}
