import Chance from "chance";
import {
  getRomanNumeralFor,
  loadJobAnimations,
  loadJobPortrait,
} from "../../common";
import { InteractiveMessage, Message } from "../Message";
import { Entity } from "./Entity";

const CHANCE = new Chance();

export class PubEntity extends Entity {
  meandering = false;
  shouldStopMeandering = false;

  interactiveMessage: null | InteractiveMessage = null;
  chatMessage: null | Message = null;

  public async load() {
    this.setLoader(loadJobAnimations);

    await super.load();

    if (this.container) {
      this.interactiveMessage = new InteractiveMessage(
        `${this.goesBy},\n\t\t${CHANCE.capitalize(
          this.name
        )} ${getRomanNumeralFor(this.stage)}`
      );
      this.interactiveMessage.container.position.set(64, -128); // FIXME
      this.interactiveMessage.container.visible = false;
      this.interactiveMessage.addActions(
        {
          title: "Chat",
          onInteraction: (event) => {
            event.stopPropagation();
            this.handleChat();
          },
        },
        {
          title: "Hire",
          onInteraction: (event) => {
            event.stopPropagation();
            this.handleHire();
          },
        }
      );
      this.container.addChild(this.interactiveMessage.container);

      this.container.interactive = true;
      this.container.buttonMode = true;
      this.container.on("mousedown", this.handleInteraction);
      this.container.on("touchstart", this.handleInteraction);
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

  private removeMessage = () => {
    if (this.container && this.interactiveMessage) {
      if (this.chatMessage) {
        this.container.removeChild(this.chatMessage.container);
        this.chatMessage.container.destroy();
        this.chatMessage = null;
      }

      this.interactiveMessage.container.visible = false;

      this.screen.interactive = false; // FIXME
      this.screen.removeListener("mousedown", this.removeMessage);
      this.screen.removeListener("touchstart", this.removeMessage);
      this.container.on("mousedown", this.handleInteraction);
      this.container.on("touchstart", this.handleInteraction);

      this.meander();
    }
  };

  private handleInteraction = () => {
    if (this.container && this.interactiveMessage) {
      this.screen.interactive = true;
      this.screen.on("mousedown", this.removeMessage);
      this.screen.on("touchstart", this.removeMessage);

      this.interactiveMessage.container.visible = true;
    }
  };

  private handleChat = () => {
    if (this.container) {
      const stuff = CHANCE.sentence({ words: 4 }).split(". ").join(".\n");
      this.stopMeandering();

      this.chatMessage = new Message(stuff, {
        progressive: true,
        duration: Infinity,
      });
      this.chatMessage.container.y -= 200;
      this.container.addChild(this.chatMessage.container);

      const portrait = loadJobPortrait(this.name);
      portrait.position.x -= 80;
      portrait.position.y -= 30;
      this.chatMessage.container.addChild(portrait);
    }
  };

  private handleHire = () => {
    alert("Hiring " + this.goesBy);
  };
}
