import * as PIXI from "pixi.js";
import { Menu } from "./Menu";
import { AttackMenu } from "./AttackMenu";

export class BattleMenu extends Menu {
  wrapper: PIXI.Container;
  activeSubmenu: null | Menu;
  attackSubmenu: null | AttackMenu;

  constructor(_screen: PIXI.Container) {
    const menuConfig = {
      fontSize: 24,
      containerXOffset: 120,
      containerYOffset: 168,
      boxYOffset: 3,
      width: 280,
      height: 9,
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
          onInteraction: () => {},
        },
        {
          title: "🪄",
          onInteraction: () => {},
        },
        {
          title: "📦",
          onInteraction: () => {},
        },
        {
          title: "🏃",
          onInteraction: () => {},
        },
      ],
    };

    super(_screen, menuConfig);

    this.activeSubmenu = null;

    this.wrapper = new PIXI.Container();
    this.container.setParent(this.wrapper);

    this.attackSubmenu = new AttackMenu(this.screen);
    this.wrapper.addChildAt(this.attackSubmenu.container, 0);
  }

  public show() {
    super.show();
    this.activeSubmenu?.show();
  }

  public hide() {
    super.hide();
    this.activeSubmenu?.hide();
  }

  private setActiveSubmenu(submenu: Menu) {
    this.activeSubmenu = submenu;
    this.displayActiveSubmenu();
  }

  private displayActiveSubmenu() {
    if (this.activeSubmenu) {
      const wasShowing = this.activeSubmenu.container.visible;

      for (const submenu of [this.attackSubmenu]) {
        submenu?.hide();
      }

      if (!wasShowing) {
        this.activeSubmenu?.show();
      }
    }
  }
}
