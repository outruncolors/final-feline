import * as PIXI from "pixi.js";
import { Menu } from "../Menu";
import { AttackMenu } from "./AttackMenu";
import { DefendMenu } from "./DefendMenu";
import { CastMenu } from "./CastMenu";
import { ItemMenu } from "./ItemMenu";
import { RunMenu } from "./RunMenu";

export class BattleMenu extends Menu {
  wrapper: PIXI.Container;
  activeSubmenu: null | Menu;
  attackSubmenu: null | AttackMenu;
  defendSubmenu: null | DefendMenu;
  castSubmenu: null | CastMenu;
  itemSubmenu: null | ItemMenu;
  runSubmenu: null | RunMenu;

  constructor(_screen: PIXI.Container) {
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

    this.activeSubmenu = null;

    this.wrapper = new PIXI.Container();
    this.container.setParent(this.wrapper);

    this.attackSubmenu = new AttackMenu(this.screen);
    this.wrapper.addChildAt(this.attackSubmenu.container, 0);

    this.defendSubmenu = new DefendMenu(this.screen);
    this.wrapper.addChildAt(this.defendSubmenu.container, 0);

    this.castSubmenu = new CastMenu(this.screen);
    this.wrapper.addChildAt(this.castSubmenu.container, 0);

    this.itemSubmenu = new ItemMenu(this.screen);
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
