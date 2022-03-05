import * as PIXI from "pixi.js";
import { ScreenKind } from "..";
import { GameChangers, GameState } from "../../App";

export const cityScript = (
  gameState: GameState,
  gameChangers: GameChangers
) => {
  setTimeout(() => {
    const screen = gameState.getScreen();

    if (screen) {
      screen.sortableChildren = true;

      const intro = screen.getChildByName(
        "screens/city/intro/screen_city_intro"
      ) as undefined | PIXI.AnimatedSprite;

      if (intro) {
        intro.loop = false;

        const locations = [
          {
            x: 0,
            y: screen.height - 270,
            width: 290,
            height: 270,
            leadsTo: "bar",
            hoverAnimation: "bar",
          },
          {
            x: 0 + 280,
            y: screen.height - 250,
            width: 170,
            height: 250,
            leadsTo: "housing",
            hoverAnimation: "housing",
          },
          {
            x: 0 + 280 + 110,
            y: 0,
            width: 170,
            height: screen.height,
            leadsTo: "tower",
            hoverAnimation: "tower",
          },
          {
            x: 0 + 280 + 110 + 110,
            y: screen.height - 280,
            width: 300,
            height: 280,
            leadsTo: "casino",
            hoverAnimation: "casino",
          },
          {
            x: 0 + 280 + 110 + 110 + 280,
            y: screen.height - 280,
            width: 300,
            height: 280,
            leadsTo: "shop",
            hoverAnimation: "shop",
          },
        ];
        const squares: PIXI.Sprite[] = [];

        intro.onComplete = () => {
          for (const location of locations) {
            const square = new PIXI.Sprite(PIXI.Texture.WHITE);
            squares.push(square);
            square.name = "TEMP";
            square.width = location.width;
            square.height = location.height;
            square.position.set(location.x, location.y);
            square.interactive = true;
            square.buttonMode = true;
            square.alpha = 0;
            square.zIndex = 1;

            const onInteraction = () => {
              gameChangers.changeScreenName(location.leadsTo as ScreenKind);
              gameChangers.changeScreenAnimation(null);

              squares.forEach((square) => {
                square.interactive = false;
              });
            };

            square.on("mousedown", onInteraction);
            square.on("touchstart", onInteraction);
            square.on("mouseover", () => {
              gameChangers.changeScreenAnimation(location.hoverAnimation);

              setTimeout(() => {
                const thing = screen.getChildByName(
                  `screens/city/${location.leadsTo}/screen_city_${location.leadsTo}`
                ) as undefined | PIXI.AnimatedSprite;

                if (thing) {
                  thing.loop = false;
                  thing.onFrameChange = (current) => {
                    if (current === 2) {
                      thing.stop();
                    }
                  };
                }
              });
            });
            square.on("mouseout", () => {
              gameChangers.changeScreenAnimation("idle");
            });

            screen.addChild(square);
          }

          gameChangers.changeScreenAnimation("idle");
        };
      }
    }
  }, 2000);
};
