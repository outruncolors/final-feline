import * as PIXI from "pixi.js";
import { BattleEntity } from "../../Entity";
import type { BattleStatus } from "../../Battle";
import { Menu } from "../Menu";

export class TargetMenu extends Menu {
  onSelectTarget: (entity: BattleEntity) => void;

  constructor(_screen: PIXI.Container, _battleStatus: BattleStatus) {
    const actions = _battleStatus.left.team
      .concat(_battleStatus.right.team)
      .map((entity) => ({
        title: `${entity.goesBy},\n${entity.name}`,
        onInteraction: () => this.onSelectTarget(entity),
      }));

    const menuConfig = {
      fontSize: 14,
      prompt:
        "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tSelect a target?".toUpperCase(),
      containerXOffset: 140,
      containerYOffset: 182,
      boxYOffset: 3,
      width: 530,
      height: 60,
      actions,
    };

    super(_screen, menuConfig);
    this.onSelectTarget = () => {};
  }
}
