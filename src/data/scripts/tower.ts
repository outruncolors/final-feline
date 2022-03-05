import * as PIXI from "pixi.js";
import type { GameState, GameChangers } from "../../App";
import { sleep } from "../../common";

export const towerEnterScript = async (
  gameState: GameState,
  gameChangers: GameChangers
) => {
  const npc = {
    name: "Nezra",
    avatar: "Nezra",
    says: (words: string, andThen?: () => void) =>
      gameChangers.changeDialogue([
        ...gameState.dialogue,
        {
          name: npc.name,
          avatar: npc.avatar,
          text: words,
          onClose: andThen,
        },
      ]),
  };

  npc.says("Oh, you're just in time!", async () => {
    gameChangers.changeScreenAnimation("send");

    await sleep(3000);

    gameChangers.changeScreenName("fight");
    gameChangers.changeScreenAnimation("idle");
  });
};

export const towerExitScript = (
  gameState: GameState,
  gameChangers: GameChangers
) => {};
