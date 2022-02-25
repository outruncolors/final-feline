import * as PIXI from "pixi.js";
import { config } from "../../common";
import { InteractiveMessage, MessageAction } from "../Message";

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

  public show() {
    if (this.container) {
      this.container.visible = true;
    }
  }

  public hide() {
    if (this.container) {
      this.container.visible = false;
    }
  }

  private build() {
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
