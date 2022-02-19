import * as PIXI from "pixi.js";
import { basicTextStyle, config } from "../common";

interface MessageOptions {
  minWidth?: number;
  minHeight?: number;
}

export class Message {
  container: PIXI.Container;
  text: PIXI.Text;
  boxWrapper: null | PIXI.Sprite = null;
  box: null | PIXI.Sprite = null;
  options: MessageOptions = {};

  constructor(_text: string, _options: MessageOptions = {}) {
    this.container = new PIXI.Container();
    this.options = { ...this.options, ..._options };

    this.buildBox();

    this.text = new PIXI.Text(_text, basicTextStyle);
    this.text.position.set(
      config.MESSAGE_BOX_PADDING * 6,
      config.MESSAGE_BOX_PADDING * 5
    );
    this.container.addChild(this.text);

    this.adjustBox();
  }

  private buildBox() {
    const sheet =
      PIXI.Loader.shared.resources[`/assets/sprites.json`].spritesheet;

    if (sheet) {
      const boxWrapper = new PIXI.Sprite(PIXI.Texture.WHITE);
      const box = new PIXI.Sprite(sheet.textures.message);
      boxWrapper.width = box.width + config.MESSAGE_BOX_PADDING * 2;
      boxWrapper.height = box.height + config.MESSAGE_BOX_PADDING * 2;
      box.position.set(config.MESSAGE_BOX_PADDING);

      this.container.addChild(boxWrapper);
      this.container.addChild(box);

      this.boxWrapper = boxWrapper;
      this.box = box;
    } else {
      throw new Error();
    }
  }

  private adjustBox() {
    if (this.boxWrapper && this.box && this.text) {
      const textWidth = this.text.width;
      const textHeight = this.text.height;
      const minWidth = this.options.minWidth ?? -Infinity;
      const minHeight = this.options.minHeight ?? -Infinity;
      this.box.width = Math.max(
        minWidth,
        textWidth + config.MESSAGE_BOX_PADDING * 8
      );
      this.box.height = Math.max(
        minHeight,
        textHeight + config.MESSAGE_BOX_PADDING * 8
      );
      this.boxWrapper.width = this.box.width + config.MESSAGE_BOX_PADDING * 2;
      this.boxWrapper.height = this.box.height + config.MESSAGE_BOX_PADDING * 2;
    }
  }
}

export class ScreenMessage extends Message {
  screen: PIXI.Container;

  constructor(
    screen: PIXI.Container,
    _text: string,
    _options: MessageOptions = {}
  ) {
    super(_text, _options);
    this.screen = screen;
    this.adjustPosition();
  }

  private adjustPosition() {
    this.container.position.set(
      config.SCREEN_MESSAGE_BOX_MARGIN,
      this.screen.height -
        this.container.height -
        config.SCREEN_MESSAGE_BOX_MARGIN * 2
    );
  }
}
