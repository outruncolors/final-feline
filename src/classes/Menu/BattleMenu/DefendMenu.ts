import * as PIXI from "pixi.js";
import { Menu } from "../Menu";

export class DefendMenu extends Menu {
  constructor(_screen: PIXI.Container, _onDefend: () => void) {
    const menuConfig = {
      fontSize: 14,
      prompt:
        "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tProtect yourself?".toUpperCase(),
      containerXOffset: 140,
      containerYOffset: 182,
      boxYOffset: 3,
      width: 520,
      height: 60,
      actions: [
        {
          title: "Defend",
          onInteraction: _onDefend
        },
      ],
    };

    super(_screen, menuConfig);
  }
}
