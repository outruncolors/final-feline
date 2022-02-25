import * as PIXI from "pixi.js";
import { Menu } from "../Menu";

export class CastMenu extends Menu {
  constructor(_screen: PIXI.Container) {
    const menuConfig = {
      fontSize: 14,
      prompt:
        "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tUse which skill?".toUpperCase(),
      containerXOffset: 140,
      containerYOffset: 182,
      boxYOffset: 3,
      width: 530,
      height: 60,
      actions: [
        {
          title: "Skill A",
          onInteraction: () => {},
        },
        {
          title: "Skill B",
          onInteraction: () => {},
        },
      ],
    };

    super(_screen, menuConfig);
  }
}
