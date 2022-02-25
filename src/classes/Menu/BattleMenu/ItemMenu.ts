import * as PIXI from "pixi.js";
import { BattleEntity } from "../../Entity";
import { ItemAndQuantity } from "../../Battle";
import { Menu } from "../Menu";

export class ItemMenu extends Menu {
  constructor(
    _screen: PIXI.Container,
    _entity: BattleEntity,
    _items: ItemAndQuantity[]
  ) {
    const actions = _items
      .map(([itemKind, quantity]) => ({
        title: `${itemKind}  (x${quantity})`,
        onInteraction: () => {
          _entity.useItem(itemKind, _entity);
        }
      }));

    const menuConfig = {
      fontSize: 14,
      prompt:
        "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tUse which item?".toUpperCase(),
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
