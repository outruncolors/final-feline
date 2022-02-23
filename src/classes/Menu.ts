import * as PIXI from "pixi.js";
import { basicTextStyle } from "../common";

export class Menu {
  container = new PIXI.Container();
  screen: PIXI.Container;

  constructor(_screen: PIXI.Container) {
    this.screen = _screen;
    const text = new PIXI.Text("Hi", basicTextStyle);
    this.container.addChild(text);
    this.screen.addChild(this.container);
  }
}

export class BattleMenu extends Menu {}
