import * as PIXI from "pixi.js";
import { Menu } from "../Menu";
import { AttackMenu } from "./AttackMenu";
import { DefendMenu } from "./DefendMenu";
import { CastMenu } from "./CastMenu";
import { ItemMenu } from "./ItemMenu";
import { RunMenu } from "./RunMenu";
import type { Battle, ItemAndQuantity } from "../../Battle";
import type { BattleEntity } from "../../Entity";

export class BattleMenu extends Menu {
  wrapper: PIXI.Container;
  attackSubmenu: null | AttackMenu;
  defendSubmenu: null | DefendMenu;
  castSubmenu: null | CastMenu;
  itemSubmenu: null | ItemMenu;
  runSubmenu: null | RunMenu;

  entity: BattleEntity;
  battle: Battle;
  items: ItemAndQuantity[];

  constructor(_screen: PIXI.Container, _entity: BattleEntity, _battle: Battle, _items: ItemAndQuantity[]) {
    const menuConfig = {
      fontSize: 24,
      containerXOffset: 120,
      containerYOffset: 168,
      boxYOffset: 3,
      width: 280,
      height: 7,
      actions: [
        {
          title: "🗡️",
          onInteraction: () => {
            if (this.attackSubmenu) {
              this.setActiveSubmenu(this.attackSubmenu);
            }
          },
        },
        {
          title: "🛡️",
          onInteraction: () => {
            if (this.defendSubmenu) {
              this.setActiveSubmenu(this.defendSubmenu);
            }
          },
        },
        {
          title: "🪄",
          onInteraction: () => {
            if (this.castSubmenu) {
              this.setActiveSubmenu(this.castSubmenu);
            }
          },
        },
        {
          title: "📦",
          onInteraction: () => {
            if (this.itemSubmenu) {
              this.setActiveSubmenu(this.itemSubmenu);
            }
          },
        },
        {
          title: "🏃",
          onInteraction: () => {
            if (this.runSubmenu) {
              this.setActiveSubmenu(this.runSubmenu);
            }
          },
        },
      ],
    };

    super(_screen, menuConfig);

    this.entity = _entity;
    this.battle = _battle;
    this.items = _items;

    this.wrapper = new PIXI.Container();
    this.container.setParent(this.wrapper);

    this.attackSubmenu = new AttackMenu(this.screen);
    this.wrapper.addChildAt(this.attackSubmenu.container, 0);

    this.defendSubmenu = new DefendMenu(this.screen);
    this.wrapper.addChildAt(this.defendSubmenu.container, 0);

    this.castSubmenu = new CastMenu(this.screen, this.entity);
    this.wrapper.addChildAt(this.castSubmenu.container, 0);

    this.itemSubmenu = new ItemMenu(this.screen, this.entity, this.items);
    this.wrapper.addChildAt(this.itemSubmenu.container, 0);

    this.runSubmenu = new RunMenu(this.screen);
    this.wrapper.addChildAt(this.runSubmenu.container, 0);
  }

  public hide() {
    super.hide();
    this.hideAllSubmenus();
  }

  private hideAllSubmenus() {
    this.attackSubmenu?.hide();
    this.defendSubmenu?.hide();
    this.castSubmenu?.hide();
    this.itemSubmenu?.hide();
    this.runSubmenu?.hide();
  }

  private setActiveSubmenu(submenu: Menu) {
    this.hideAllSubmenus();
    setTimeout(() => submenu.show());
  }
}
