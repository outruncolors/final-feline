import * as PIXI from "pixi.js";
import { BattleEntity } from "../../Entity";
import type { BattleStatus } from "../../Battle";
import { Menu } from "../Menu";

export class TargetMenu extends Menu {
  constructor(
    _screen: PIXI.Container,
    _battleStatus: BattleStatus,
    _onSelectTarget: (entity: BattleEntity) => void
  ) {
    const actions = _battleStatus.left
      .concat(_battleStatus.right)
      .flatMap(({ team }) => [...team])
      .map((entity) => ({
        title: entity.name,
        onInteraction: () => _onSelectTarget(entity),
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
  }
}
