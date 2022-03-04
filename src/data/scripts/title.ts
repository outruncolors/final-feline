import * as PIXI from "pixi.js";
import { GameChangers, GameState } from "../../App";

export const titleScript = (
  gameState: GameState,
  gameChangers: GameChangers
) => {
  const screen = gameState.getScreen();

  if (screen) {
    const title = screen.getChildByName(
      "screens/title/title/screen_title_title"
    ) as undefined | PIXI.AnimatedSprite;

    if (title) {
      title.loop = false;

      title.onComplete = () => {
        title.gotoAndStop(0);
        gameChangers.changeScreenName("city");
      };
    }
  }
};
