import * as PIXI from "pixi.js";
import { config } from "../common";
import { InteractiveMessage } from "./Message";

export class Menu {
  container = new PIXI.Container();
  screen: PIXI.Container;

  constructor(_screen: PIXI.Container) {
    this.screen = _screen;
    this.screen.addChild(this.container);

    this.build();
  }

  private build() {
    const message = new InteractiveMessage("                ");
    this.container.addChild(message.container);

    if (message.box && message.boxWrapper) {
      this.container.position.x += 120
      this.container.position.y += 168
      message.boxWrapper.position.y += 3
      message.box.position.y += 3

      message.box.width = 280;
      message.box.height = 9;

      message.boxWrapper.width =
        message.box.width + config.MESSAGE_BOX_PADDING * 2;
      message.boxWrapper.height =
        message.box.height + config.MESSAGE_BOX_PADDING * 2;
    }

    message.addActions(
      {
        title: "🗡️",
        onInteraction: () => {},
      },
      {
        title: "🛡️",
        onInteraction: () => {},
      },
      {
        title: "🪄",
        onInteraction: () => {},
      },
      {
        title: "📦",
        onInteraction: () => {},
      },
      {
        title: "🏃",
        onInteraction: () => {},
      }
    );

    this.container.visible = false;
  }
}

export class BattleMenu extends Menu {}
