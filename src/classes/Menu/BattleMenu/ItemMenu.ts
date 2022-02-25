import * as PIXI from "pixi.js";
import { Menu } from "../Menu";

export class ItemMenu extends Menu {
  constructor(_screen: PIXI.Container) {
    const menuConfig = {
      fontSize: 14,
      prompt:
        "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tUse which item?".toUpperCase(),
      containerXOffset: 140,
      containerYOffset: 182,
      boxYOffset: 3,
      width: 530,
      height: 60,
      actions: [
        {
          title: "Item A",
          onInteraction: () => {},
        },
        {
          title: "Item B",
          onInteraction: () => {},
        },
      ],
    };

    super(_screen, menuConfig);
  }
}
