import * as PIXI from "pixi.js";
import { GameChangers, GameState } from "../../App";

export const cityScript = (
  gameState: GameState,
  gameChangers: GameChangers
) => {
  setTimeout(() => {
    const screen = gameState.getScreen();

    if (screen) {
      const intro = screen.getChildByName(
        "screens/city/intro/screen_city_intro"
      ) as undefined | PIXI.AnimatedSprite;

      if (intro) {
        intro.loop = false;

        intro.onComplete = () => {
          const square = new PIXI.Sprite(PIXI.Texture.WHITE);
          square.width = 300;
          square.height = 300;
          square.position.set(0, screen.height - square.height);
          square.interactive = true;
          square.buttonMode = true;
          square.alpha = 0;

          gameChangers.changeScreenAnimation("idle");

          const onInteraction = () => {
            gameChangers.changeScreenName("bar");
            gameChangers.changeScreenAnimation(null);
            square.destroy();
          };

          square.on("mousedown", onInteraction);
          square.on("touchstart", onInteraction);

          square.on("mouseover", () => {
            gameChangers.changeScreenAnimation("bar");

            setTimeout(() => {
              const bar = screen.getChildByName(
                "screens/city/bar/screen_city_bar"
              ) as undefined | PIXI.AnimatedSprite;

              if (bar) {
                bar.loop = false;
                bar.onFrameChange = (current) => {
                  if (current === 2) {
                    bar.stop();
                  }
                };
              }
            });
          });

          square.on("mouseout", () => {
            gameChangers.changeScreenAnimation("idle");
          });

          screen.addChild(square);
        };
      }
    }
  }, 2000);
};
