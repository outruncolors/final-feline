import * as PIXI from "pixi.js";
import { InteractionEvent } from "pixi.js";
import { basicTextStyle, colors, config, loadExtraSprite } from "../common";

export interface MessageOptions {
  minWidth?: number;
  minHeight?: number;
  duration?: number;
  progressive?: boolean;
  onFlashEnd?: () => void;
}

type FlashStatus = "in" | "none" | "out" | "done";

interface MessageAction {
  title: string;
  onInteraction(e: InteractionEvent): void;
}

export class Message {
  container: PIXI.Container;
  text: PIXI.Text;
  boxWrapper: null | PIXI.Sprite = null;
  box: null | PIXI.Sprite = null;
  options: MessageOptions = {};
  flashCounter = 0;
  flashStatus: FlashStatus = "none";
  ticker: null | PIXI.Ticker = null;

  // P r o g r e s s i v e
  progressive: boolean;
  displayedText = "";
  fullText = "";
  textCounter = 0;

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

    this.progressive = Boolean(this.options.progressive);

    if (this.progressive) {
      this.fullText = _text;
      this.text.text = "";
    }

    if (this.options.duration) {
      this.flash();
    }
  }

  private buildBox() {
    const boxWrapper = new PIXI.Sprite(PIXI.Texture.WHITE);
    const message = loadExtraSprite("message");

    boxWrapper.width = message.width + config.MESSAGE_BOX_PADDING * 2;
    boxWrapper.height = message.height + config.MESSAGE_BOX_PADDING * 2;
    message.position.set(config.MESSAGE_BOX_PADDING);

    this.container.addChild(boxWrapper);
    this.container.addChild(message);

    this.boxWrapper = boxWrapper;
    this.box = message;
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

  private flash() {
    this.ticker = PIXI.Ticker.shared.add(this.update.bind(this));
    this.flashStatus = "in";
    this.container.alpha = 0;
  }

  private update() {
    const progressiveDone =
      !this.progressive ||
      (this.progressive && this.displayedText === this.fullText);

    if (this.flashStatus === "in") {
      this.flashCounter++;
      this.container.alpha += 0.1;

      if (this.flashCounter === 10) {
        this.flashCounter = 0;
        this.container.alpha = 1;
        this.flashStatus = "none";
      }
    } else if (this.flashStatus === "none") {
      if (progressiveDone) {
        this.flashCounter++;

        const duration = this.options.duration ?? 180;

        if (this.flashCounter >= duration) {
          this.flashCounter = 0;
          this.flashStatus = "out";
        }
      }
    } else if (this.flashStatus === "out") {
      this.flashCounter++;
      this.container.alpha -= 0.1;

      if (this.flashCounter === 60) {
        this.flashCounter = 0;
        this.container.alpha = 0;
        this.flashStatus = "done";

        if (this.options.onFlashEnd) {
          this.options.onFlashEnd();
        }
      }
    }

    if (this.progressive && !progressiveDone) {
      this.textCounter++;

      if (this.textCounter === config.MESSAGE_BOX_PROGRESSIVE_DISPLAY_RATE) {
        this.textCounter = 0;

        for (let i = 0; i < this.fullText.length; i++) {
          const letterA = this.displayedText[i];
          const letterB = this.fullText[i];

          if (letterA !== letterB) {
            this.displayedText = `${this.displayedText}${letterB}`;
            this.text.text = this.displayedText;
            break;
          }
        }
      }
    }
  }
}

// A type of message which appears in the top middle, usually during battle.
export class BattleMessage extends Message {
  screen: PIXI.Container;

  constructor(
    screen: PIXI.Container,
    _text: string,
    _options: MessageOptions = {}
  ) {
    const options = {
      duration: 180,
      progressive: true,
      ..._options,
    };
    super(_text, options);

    this.screen = screen;
    this.adjustPosition();
  }

  private adjustPosition() {
    this.container.position.set(
      this.screen.width / 2 - this.container.width / 1.5,
      config.SCREEN_MESSAGE_BOX_MARGIN
    );
  }
}

// A type of message which stretches along the bottom of the screen.
export class ScreenMessage extends Message {
  screen: PIXI.Container;
  shared: Message;
  hasAvatar: boolean;

  constructor(
    screen: PIXI.Container,
    _text: string,
    _options: MessageOptions & { hasAvatar?: boolean } = {}
  ) {
    super(_text, _options);
    this.screen = screen;
    this.shared = new Message("", {
      minWidth: document.body.clientWidth - 8,
      minHeight: 235,
    });
    this.hasAvatar = Boolean(_options.hasAvatar);

    this.adjustPosition();
  }

  public change(to: string) {
    this.text.text = to;

    if (this.hasAvatar) {
      this.text.position.x = 128;
    }
  }

  public clear() {
    this.hasAvatar = false;
    this.text.text = "";
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

export class InteractiveMessage extends Message {
  public addActions(...actions: MessageAction[]) {
    const actionWrapper = new PIXI.Container();

    for (const { title, onInteraction } of actions) {
      const action = new PIXI.Text(title, basicTextStyle);
      action.style.fontSize = 24;
      action.interactive = true;
      action.cursor = "pointer";
      action.on("mousedown", onInteraction);
      action.on("touchstart", onInteraction);
      action.on("mouseover", () => {
        action.tint = colors.yellow;
      });
      action.on("mouseout", () => {
        action.tint = colors.white;
      });

      let distance = config.MESSAGE_BOX_PADDING * 2;
      for (let _child of actionWrapper.children) {
        const child = _child as PIXI.Text;
        distance += child.width + config.MESSAGE_BOX_PADDING * 4;
      }

      action.position.x = distance;
      actionWrapper.addChild(action);
    }

    const [whiteBox, blueBox] = this.container.children as [
      PIXI.Sprite,
      PIXI.Sprite
    ];

    whiteBox.height += actionWrapper.height;
    blueBox.height += actionWrapper.height;
    actionWrapper.position.set(
      config.MESSAGE_BOX_PADDING * 4,
      this.container.height - actionWrapper.height - config.MESSAGE_BOX_PADDING
    );
    this.container.addChild(actionWrapper);
    this.container.cursor = "auto";
  }
}
