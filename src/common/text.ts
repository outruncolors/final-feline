import * as PIXI from "pixi.js";
import { colors } from "./colors";

export const basicTextStyle = new PIXI.TextStyle({
  fontSize: 24,
  dropShadow: true,
  dropShadowColor: colors.grey,
  fill: colors.white,
  stroke: colors.red,
  strokeThickness: 4,
});
