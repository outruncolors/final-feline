import * as PIXI from "pixi.js";
import { Menu } from "../Menu";
import { DefendMenu } from "./DefendMenu";
import { CastMenu } from "./CastMenu";
import { ItemMenu } from "./ItemMenu";
import { RunMenu } from "./RunMenu";
import { TargetMenu } from "./TargetMenu";
import type { Battle, ItemAndQuantity } from "../../Battle";
import type { BattleEntity } from "../../Entity";
import type { ItemKind, SkillKind } from "../../../data";

export class BattleMenu extends Menu {
  wrapper: PIXI.Container;
  defendSubmenu: null | DefendMenu;
  castSubmenu: null | CastMenu;
  itemSubmenu: null | ItemMenu;
  runSubmenu: null | RunMenu;
  targetSubmenu: null | TargetMenu;

  entity: BattleEntity;
  battle: Battle;
  items: ItemAndQuantity[];
  skillKind: null | SkillKind;
  itemKind: null | ItemKind;

  constructor(
    _screen: PIXI.Container,
    _entity: BattleEntity,
    _battle: Battle,
    _items: ItemAndQuantity[]
  ) {
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
            if (this.targetSubmenu) {
              this.targetForAttack();
              this.setActiveSubmenu(this.targetSubmenu);
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
              this.skillKind = null;
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
    this.skillKind = null;
    this.itemKind = null;

    this.wrapper = new PIXI.Container();
    this.container.setParent(this.wrapper);

    this.defendSubmenu = new DefendMenu(this.screen);
    this.wrapper.addChildAt(this.defendSubmenu.container, 0);

    this.castSubmenu = new CastMenu(
      this.screen,
      this.entity,
      this.targetForCast.bind(this)
    );
    this.wrapper.addChildAt(this.castSubmenu.container, 0);

    this.itemSubmenu = new ItemMenu(
      this.screen,
      this.entity,
      this.items,
      this.targetForItem.bind(this)
    );
    this.wrapper.addChildAt(this.itemSubmenu.container, 0);

    this.runSubmenu = new RunMenu(this.screen);
    this.wrapper.addChildAt(this.runSubmenu.container, 0);

    this.targetSubmenu = new TargetMenu(this.screen, this.battle.status);
    this.wrapper.addChildAt(this.targetSubmenu.container, 0);
  }

  public hide() {
    super.hide();
    this.hideAllSubmenus();
  }

  private hideAllSubmenus() {
    this.defendSubmenu?.hide();
    this.castSubmenu?.hide();
    this.itemSubmenu?.hide();
    this.runSubmenu?.hide();
    this.targetSubmenu?.hide();
  }

  private setActiveSubmenu(submenu: Menu) {
    this.hideAllSubmenus();
    setTimeout(() => submenu.show(), 250);
  }

  private targetForAttack() {
    if (this.targetSubmenu) {
      this.targetSubmenu.onSelectTarget = this.handleAttackAction.bind(this);
    }
  }

  private handleAttackAction(target: BattleEntity) {
    this.entity.attack(target);
    this.hideAllSubmenus();
  }

  private targetForCast(skillKind: SkillKind) {
    if (this.targetSubmenu) {
      this.skillKind = skillKind;
      this.targetSubmenu.onSelectTarget = this.handleCastAction.bind(this);
      this.setActiveSubmenu(this.targetSubmenu);
    }
  }

  private handleCastAction(target: BattleEntity) {
    if (this.skillKind) {
      this.entity.cast(this.skillKind, target);
      this.skillKind = null;
    }

    this.hideAllSubmenus();
  }

  private targetForItem(itemKind: ItemKind) {
    if (this.targetSubmenu) {
      this.itemKind = itemKind;
      this.targetSubmenu.onSelectTarget = this.handleUseItem.bind(this);
      this.setActiveSubmenu(this.targetSubmenu);
    }
  }

  private handleUseItem(target: BattleEntity) {
    if (this.itemKind) {
      this.entity.useItem(this.itemKind, target);
    }

    this.hideAllSubmenus();
  }
}
