import * as PIXI from "pixi.js";
import { Menu } from "../Menu";

export class RunMenu extends Menu {
  constructor(_screen: PIXI.Container) {
    const menuConfig = {
      fontSize: 14,
      prompt:
        "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tFlee the scene?".toUpperCase(),
      containerXOffset: 140,
      containerYOffset: 182,
      boxYOffset: 3,
      width: 530,
      height: 60,
      actions: [
        {
          title: "Split",
          onInteraction: () => {},
        },
      ],
    };

    super(_screen, menuConfig);
  }
}
