import * as PIXI from "pixi.js";
import Chance from "chance";
import { colors, config } from "../common";

const CHANCE = new Chance();
const ticker = PIXI.Ticker.shared;

export class ScreenFader {
    public static shared = new PIXI.Container();

  public static async fade(
    screen: PIXI.Container,
    multiplier = 1,
    forwards = false
  ) {
    const container = ScreenFader.shared = new PIXI.Container();
    const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    sprite.tint = colors.black;

    const overlay = new PIXI.filters.NoiseFilter();
    overlay.noise = 0.5;
    const blur = new PIXI.filters.BlurFilter();
    blur.blur = CHANCE.integer({ min: 2, max: 4 });
    sprite.filters = [overlay];
    sprite.width = 1920;
    sprite.height = 1080;
    sprite.alpha = multiplier > 0 ? 1 : 0;
    sprite.position.set(0, 0);

    container.addChild(sprite);
    screen.parent.addChild(container);

    let timePassed = 0;
    let secondTimePassed = -1;
    ticker.add(() => {
      timePassed += 16.67;
      overlay.seed = Math.random();
      blur.blur = CHANCE.integer({ min: 2, max: 4 });

      if (timePassed >= config.SCREEN_FADE_TIME_IN_MS && !container.destroyed) {
        if (secondTimePassed === -1) {
          timePassed += 16.67;

          if (timePassed >= config.SCREEN_FADE_TIME_IN_MS) {
            secondTimePassed = 0;
          }
        } else {
          secondTimePassed += 16.67;

          if (forwards) {
              sprite.alpha = 1;
          } else if (secondTimePassed >= config.SCREEN_FADE_TIME_IN_MS / 3) {
            container.destroy();
          } else if (multiplier < 0) {
            sprite.alpha += 0.03 * multiplier;
          }
        }
      } else {
        const percent = timePassed / config.SCREEN_FADE_TIME_IN_MS;
        sprite.alpha = multiplier > 0 ? 1 - percent : percent;
      }
    });
  }

  public static async fadeIn(screen: PIXI.Container) {
    await ScreenFader.fade(screen);
  }

  public static async fadeOut(screen: PIXI.Container) {
    await ScreenFader.fade(screen, -1, true);
  }
}
