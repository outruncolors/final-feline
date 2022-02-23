import * as PIXI from "pixi.js";
import Chance from "chance";
import { getRomanNumeralFor, loadJobAnimations } from "../../common";
import { EntityKind } from "../../data";
import { InteractiveMessage, ScreenMessage } from "../Message";
import { Entity } from "./Entity";

const CHANCE = new Chance();

export class PubEntity extends Entity {
  controller: ScreenMessage;
  meandering = false;
  shouldStopMeandering = false;

  constructor(
    _name: EntityKind,
    _screen: PIXI.Container,
    _controller: ScreenMessage
  ) {
    super(_name, _screen);
    this.controller = _controller;
  }

  public async load() {
    this.setLoader(loadJobAnimations);

    await super.load();

    if (this.container) {
      const handleInteraction = () => {
        if (this.container) {
          const message = new InteractiveMessage(
            `${this.goesBy},\n\t\t${CHANCE.capitalize(
              this.name
            )} ${getRomanNumeralFor(this.stage)}`
          );
          message.container.position.set(64, -128); // FIXME
          this.container.addChild(message.container);

          const removeMessage = () => {
            if (this.container) {
              this.container.removeChild(message.container);

              message.container.destroy();

              this.screen.interactive = false; // FIXME
              this.screen.removeListener("mousedown", removeMessage);
              this.screen.removeListener("touchstart", removeMessage);
              this.container.on("mousedown", handleInteraction);
              this.container.on("touchstart", handleInteraction);

              this.controller.clear();
              this.meander();
            }
          };

          this.screen.interactive = true;
          this.screen.on("mousedown", removeMessage);
          this.screen.on("touchstart", removeMessage);

          message.addActions({
            title: "Chat",
            onInteraction: (event) => {
              event.stopPropagation();
              this.handleChat();
            },
          });
        }
      };

      this.container.cursor = "pointer";
      this.container.interactive = true;
      this.container.on("mousedown", handleInteraction);
      this.container.on("touchstart", handleInteraction);
    }
  }

  public update() {
    super.update();

    if (this.meandering) {
      if (this.shouldStopMeandering) {
        this.stopMeandering();
        this.meandering = false;
        this.shouldStopMeandering = false;
      } else {
        this.startMeandering();
      }
    }
  }

  private handleChat = () => {
    const stuff = CHANCE.sentence({ words: 4 }).split(". ").join(".\n");
    this.stopMeandering();
    this.controller.change(stuff);
  };

  private startMeandering() {
    const willMove = CHANCE.bool({ likelihood: 1 });

    if (willMove) {
      const method = CHANCE.pickone([
        this.stepUp.bind(this),
        this.stepBack.bind(this),
      ]);
      method();
    }
  }

  public stopMeandering() {
    this.shouldStopMeandering = true;
  }

  public meander() {
    this.meandering = true;
  }
}
