import * as PIXI from "pixi.js";
import { Menu } from "./Menu";

export class AttackMenu extends Menu {
  constructor(_screen: PIXI.Container) {
    const menuConfig = {
      fontSize: 14,
      prompt:
        "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tSelect a target.".toUpperCase(),
      containerXOffset: 140,
      containerYOffset: 182,
      boxYOffset: 3,
      width: 500,
      height: 28,
      actions: [
        {
          title: "\nTarget A\t\t",
          onInteraction: () => {},
        },
        {
          title: "\nTarget B\t\t",
          onInteraction: () => {},
        },
        {
          title: "\nTarget C",
          onInteraction: () => {},
        },
      ],
    };

    super(_screen, menuConfig);
  }
}
