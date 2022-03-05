import * as PIXI from "pixi.js";
import { GameChangers, GameState } from "../../App";

let hasGreeted = false;
export const barEnterScript = (
  gameState: GameState,
  gameChangers: GameChangers
) => {
  const screen = gameState.getScreen();
  const onClose = () => {
    gameChangers.changeScreenAnimation("blink");
    gameChangers.randomizeScreenAnimation(1000);
  };

  if (screen) {
    if (hasGreeted) {
      gameChangers.changeDialogue([
        {
          name: "Nyako",
          avatar: "Nyako",
          text: "Welcome back!",
          onClose,
        },
      ]);
    } else {
      hasGreeted = true;
      gameChangers.changeDialogue([
        {
          name: "Nyako",
          avatar: "Nyako",
          text: "Hiya! Welcome to Electric Saturn.",
        },
        {
          name: "Nyako",
          avatar: "Nyako",
          text: "Let me know if you need anything! Nyaa~",
          onClose,
        },
      ]);
    }
  }
};

export const barExitScript = (
  gameState: GameState,
  gameChangers: GameChangers
) => {
  gameChangers.randomizeScreenAnimation(-1);
  gameChangers.changeScreenAnimation("talk");
};
