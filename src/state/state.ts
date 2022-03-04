import { ReactNode } from "react";
import * as Ant from "antd";
import * as PIXI from "pixi.js";
import {
  IObjectDidChange,
  makeAutoObservable,
  observe,
  configure,
  observable,
} from "mobx";
import { colors, loadScreenAnimations } from "../common";
import {
  AfflictionKind,
  FoeKind,
  ItemKind,
  JobKind,
  ScreenKind,
  SkillKind,
} from "../data";
import type { MenuKind } from "../components";

export type GameStateProperty = keyof MyGameState;

// === config
const config = {
  SCREEN_SIZE: [1920 / 2, 1080 / 2],
};

configure({
  enforceActions: "never",
});

export class MyGameState {
  app: PIXI.Application;
  ticks = 0;
  player = {
    id: "",
    name: "Bob",
    stuff: [] as ItemAndQuantity[],
    party: [] as TeamMember[],
    roster: [] as TeamMember[],
    felidae: 0,
    transactions: [],
  };
  screen = {
    container: null as null | PIXI.Container,
    which: null as null | ScreenKind,
    width: 1920 / 2,
    height: 1080 / 2,
    fuzzing: false,
    animation: null as null | string,
  };
  notifications = [] as GameNotification[];
  log = [] as GameLog[];
  dialogue = [] as GameDialogue[];
  menu = null as null | MenuKind;

  constructor() {
    this.app = new PIXI.Application({
      width: this.screen.width,
      height: this.screen.height,
    });
    this.screen.container = new PIXI.Container();

    this.app.stage.addChild(this.screen.container);
    this.app.renderer.render(this.app.stage);

    makeAutoObservable(this);

    (window as any).GAME_STATE = this;
  }
}

export const state = observable(new MyGameState());

export type GameStateChangeHandler = (
  change: IObjectDidChange<MyGameState>
) => void;

const handleScreenChange: GameStateChangeHandler = (change) => {
  if (change.name === "which") {
    if (state.screen.which && state.screen.animation) {
      const animations = loadScreenAnimations(state.screen.which);

      const { animation } = state.screen;
      const [defaultAnimation] = Object.values(animations);
      const animationToUse = animation
        ? animations[animation]
        : defaultAnimation;

      if (animationToUse) {
        state.screen.container?.addChild(animationToUse);
      }
    }
  }

  if (change.name === "fuzzing" && state.screen.container) {
    if ((change as any).newValue) {
      const fuzzer = new PIXI.Sprite(PIXI.Texture.WHITE);
      fuzzer.name = "fuzzer";
      fuzzer.width = state.screen.container.width;
      fuzzer.height = state.screen.container.height;
      const noise = new PIXI.filters.NoiseFilter();
      fuzzer.filters = [noise];
      fuzzer.tint = colors.black;
      state.screen.container.addChild(fuzzer);
    } else {
      const fuzzer = state.screen.container.getChildByName("fuzzer");

      if (fuzzer) {
        state.screen.container.removeChild(fuzzer);
      }
    }
  }
};
observe(state.screen, handleScreenChange);

const handleNotificationsChange: GameStateChangeHandler = () => {
  const { message } = state.notifications[0];

  Ant.notification.open({
    message,
    style: {
      position: "fixed",
      top: 200,
      right: 815,
      width: 400,
    },
  });
};
observe(state.notifications, handleNotificationsChange);

const handleLogChange: GameStateChangeHandler = () => {
  const newest = { ...state.log[0] };
  console.log(`Log) [${newest.kind}]: `, newest.message);
};
observe(state.log, handleLogChange);

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

export interface GameDialogue {
  name: string;
  avatar: string;
  text: string;
}

export interface GameLog {
  kind: string;
  message: string;
}

export interface GameNotification {
  message: ReactNode;
  duration: number;
}
