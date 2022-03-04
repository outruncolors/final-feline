import * as PIXI from "pixi.js";
import { GameChangers, GameState } from "../../App";

export const barScript = (gameState: GameState, gameChangers: GameChangers) => {
  const screen = gameState.getScreen();

  if (screen) {
    gameChangers.changeDialogue([
      {
        name: "Bob",
        avatar: "Bob",
        text: "A",
      },
      {
        name: "Bob",
        avatar: "Bob",
        text: "B",
        onClose: () => {
          gameChangers.changeScreenAnimation("blink");
          gameChangers.randomizeScreenAnimation(1000);
        },
      },
    ]);
  }
};
