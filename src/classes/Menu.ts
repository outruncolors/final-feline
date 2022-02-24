import * as PIXI from "pixi.js";
import { MessageAction } from ".";
import { config } from "../common";
import { InteractiveMessage } from "./Message";

interface MenuConfig {
  prompt?: string;
  fontSize?: number;
  containerXOffset: number;
  containerYOffset: number;
  boxYOffset: number;
  width: number;
  height: number;
  actions: MessageAction[];
}

export class Menu {
  container = new PIXI.Container();
  screen: PIXI.Container;
  config: MenuConfig;

  constructor(_screen: PIXI.Container, _config: MenuConfig) {
    this.screen = _screen;
    this.container.addChild(this.container);
    this.config = _config;

    this.build();
  }

  private build() {
    // const message = new InteractiveMessage("                ");
    const message = new InteractiveMessage(this.config.prompt ?? "", {
      fontSize: this.config.fontSize || 24,
    });
    this.container.addChild(message.container);

    if (message.box && message.boxWrapper) {
      this.container.position.x += this.config.containerXOffset;
      this.container.position.y += this.config.containerYOffset;
      message.boxWrapper.position.y += this.config.boxYOffset;
      message.box.position.y += this.config.boxYOffset;

      message.box.width = this.config.width;
      message.box.height = this.config.height;

      message.boxWrapper.width =
        message.box.width + config.MESSAGE_BOX_PADDING * 2;
      message.boxWrapper.height =
        message.box.height + config.MESSAGE_BOX_PADDING * 2;
    }

    message.addActions(...this.config.actions);

    this.container.visible = false;
  }
}

export class BattleMenu extends Menu {
  wrapper: PIXI.Container;
  attackSubmenu: null | AttackMenu;

  constructor(_screen: PIXI.Container) {
    const menuConfig = {
      fontSize: 24,
      containerXOffset: 120,
      containerYOffset: 168,
      boxYOffset: 3,
      width: 280,
      height: 9,
      actions: [
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
        },
      ],
    };

    super(_screen, menuConfig);

    this.wrapper = new PIXI.Container();
    this.container.setParent(this.wrapper);

    this.attackSubmenu = new AttackMenu(this.screen);
    this.wrapper.addChildAt(this.attackSubmenu.container, 0);
  }
}

export class AttackMenu extends Menu {
  constructor(_screen: PIXI.Container) {
    const menuConfig = {
      fontSize: 14,
      prompt: "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tSelect a target.".toUpperCase(),
      containerXOffset: 140,
      containerYOffset: 182,
      boxYOffset: 3,
      width: 500,
      height: 28,
      actions: [
        {
          title: "\nTarget A\t\t",
          onInteraction: () => {},
        },
        {
          title: "\nTarget B\t\t",
          onInteraction: () => {},
        },
        {
          title: "\nTarget C",
          onInteraction: () => {},
        },
      ],
    };

    super(_screen, menuConfig);

    this.container.visible = true;
  }
}
