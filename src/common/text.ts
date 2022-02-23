import * as PIXI from "pixi.js";
import { colors } from "./colors";

const basicText = {
  fontSize: 24,
  dropShadow: true,
  dropShadowColor: colors.grey,
  fill: colors.white,
  letterSpacing: 4,
};
export const basicTextStyle = new PIXI.TextStyle(basicText);

export const titleTextStyle = new PIXI.TextStyle({
  ...basicText,
  fontSize: 48,
  letterSpacing: 8,
});

export const makeHighlightable = (text: PIXI.Text) => {
  text.interactive = true;
  text.buttonMode = true;
  text.on("mouseover", () => {
    text.tint = colors.yellow;
  });
  text.on("mouseout", () => {
    text.tint = colors.white;
  });
};

export const getRomanNumeralFor = (arabic: number) =>
  ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][arabic - 1];
