import * as PIXI from "pixi.js";
import Chance from "chance";
import {
  basicTextStyle,
  colors,
  config,
  loadExtraAnimation,
  loadJobAnimations,
} from "../../common";
import { EntityKind } from "../../data";
import { BattleMenu } from "../Menu";
import { BattleEntity } from "./BattleEntity";

const CHANCE = new Chance();

export class BattleEntityWithUI extends BattleEntity {
  vitalBox: null | PIXI.AnimatedSprite = null;
  vitalBoxOver: null | PIXI.AnimatedSprite = null;
  vitalsTextContainer: null | PIXI.Container = null;
  hpBar: null | PIXI.Graphics = null;
  mpBar: null | PIXI.Graphics = null;
  atbBar: null | PIXI.Graphics = null;
  finaleBar: null | PIXI.Graphics = null;
  readyFlashDirection: "in" | "out" = "in";
  battleMenu: null | BattleMenu = null;

  public async load() {
    await super.load();
    this.addVitals();
    this.addBattleMenu();
  }

  public update() {
    super.update();

    if (this.animations) {
      if (this.isFoe) {
        if (this.isDead) {
          this.flashDying();
        }
      } else {
        if (this.isReady && !this.isDead && !this.vitalBox?.visible) {
          this.flashReady();
        } else {
          this.animations.effects.unready();

          if (this.isReady && !this.isDead) {
            this.battleMenu?.show();
          }
        }
      }
    }
  }

  public syncStats() {
    super.syncStats();

    const stats = this.currentStats;

    if (stats) {
      this.addHPBar();
      this.addMPBar();
      this.addATBBar();
      this.addFINBar();
    }
  }

  private addVitals() {
    if (this.container) {
      this.vitalBox = loadExtraAnimation("vitals");
      this.vitalBox.position.x += 32;
      this.vitalBox.position.y -= 38;
      this.container.addChildAt(this.vitalBox, 0);

      this.vitalBoxOver = loadExtraAnimation("vitals-over");
      this.vitalBoxOver.position.x += 32;
      this.vitalBoxOver.position.y -= 38;
      this.vitalBoxOver.interactive = true;
      this.container.addChild(this.vitalBoxOver);

      this.vitalBox.play();
      this.vitalBoxOver.play();
      this.vitalBox.visible = false;
      this.vitalBoxOver.visible = false;

      this.container.interactive = true;
      this.container.buttonMode = true;
      this.container.on("mousedown", () => setTimeout(this.showVitals));
      this.container.on("touchstart", () => setTimeout(this.showVitals));

      this.addHPBar();
      this.addMPBar();
      this.addATBBar();
      this.addFINBar();

      setTimeout(this.addVitalsText.bind(this));
    }
  }

  private addHPBar() {
    if (this.vitalBox) {
      if (this.hpBar) {
        this.hpBar.clear();
        this.vitalBox.removeChild(this.hpBar);
      }

      this.hpBar = new PIXI.Graphics();

      const maxHP = this.baseStats!.HP[1];
      const percent = this.lastVitalStats.HP / maxHP;

      this.hpBar.beginFill(colors.hp);
      this.hpBar.drawRect(
        config.ENTITY_VITAL_BAR_X_OFFSET,
        config.ENTITY_VITAL_BAR_Y_OFFSET,
        config.ENTITY_VITAL_BAR_WIDTH * percent,
        config.ENTITY_VITAL_BAR_HEIGHT
      );
      this.hpBar.endFill();
      this.vitalBox.addChild(this.hpBar);
    }
  }

  private addMPBar() {
    if (this.vitalBox) {
      if (this.mpBar) {
        this.mpBar.clear();
        this.vitalBox.removeChild(this.mpBar);
      }

      this.mpBar = new PIXI.Graphics();

      const maxMP = this.baseStats!.MP[1];
      const percent = this.lastVitalStats.MP / maxMP;

      this.mpBar.beginFill(colors.mp);
      this.mpBar.drawRect(
        config.ENTITY_VITAL_BAR_X_OFFSET,
        config.ENTITY_VITAL_BAR_Y_OFFSET +
          config.ENTITY_VITAL_BAR_Y_DISTANCE * 1,
        config.ENTITY_VITAL_BAR_WIDTH * percent,
        config.ENTITY_VITAL_BAR_HEIGHT
      );
      this.mpBar.endFill();
      this.vitalBox.addChild(this.mpBar);
    }
  }

  private addATBBar() {
    if (this.vitalBox) {
      if (this.atbBar) {
        this.atbBar.clear();
        this.vitalBox.removeChild(this.atbBar);
      }

      this.atbBar = new PIXI.Graphics();

      const percent = this.lastVitalStats.ATB / 100;
      const color = this.isReady ? colors.yellow : colors.atb;

      this.atbBar.beginFill(color);
      this.atbBar.drawRect(
        config.ENTITY_VITAL_BAR_X_OFFSET,
        config.ENTITY_VITAL_BAR_Y_OFFSET +
          config.ENTITY_VITAL_BAR_Y_DISTANCE * 2,
        config.ENTITY_VITAL_BAR_WIDTH * percent,
        config.ENTITY_ATB_BAR_HEIGHT
      );
      this.atbBar.endFill();
      this.vitalBox.addChild(this.atbBar);
    }
  }

  private addFINBar() {
    if (this.vitalBox) {
      if (this.finaleBar) {
        this.finaleBar.clear();
        this.vitalBox.removeChild(this.finaleBar);
      }

      this.finaleBar = new PIXI.Graphics();

      const percent = this.lastVitalStats.FIN / 100;
      const height = Math.min(
        config.ENTITY_FINALE_BAR_HEIGHT * percent,
        config.ENTITY_FINALE_BAR_HEIGHT
      );
      const distance = config.ENTITY_FINALE_BAR_HEIGHT - height;
      const color =
        percent === 1
          ? CHANCE.pickone([colors.red, colors.yellow, colors.blue])
          : colors.fin;

      this.finaleBar.beginFill(color);
      this.finaleBar.drawRect(
        config.ENTITY_VITAL_BAR_X_OFFSET + config.ENTITY_VITAL_BAR_WIDTH + 1,
        config.ENTITY_FINALE_BAR_HEIGHT + distance,
        config.ENTITY_FINALE_BAR_WIDTH,
        height
      );
      this.finaleBar.endFill();
      this.vitalBox.addChild(this.finaleBar);
    }
  }

  private addVitalsText() {
    if (this.container) {
      this.vitalsTextContainer = new PIXI.Container();
      this.vitalsTextContainer.name = "Vital Text";
      this.vitalsTextContainer.visible = false;
      this.container.addChild(this.vitalsTextContainer);

      this.vitalsTextContainer.position.set(66, 110);

      const stage = new PIXI.Text(this.stage.toString(), {
        ...basicTextStyle,
        strokeThickness: 3,
        fontWeight: "bolder",
        fontSize: 40,
        dropShadow: false,
      });
      this.vitalsTextContainer.addChild(stage);

      const shortened = this.isFoe
        ? this.goesBy
        : this.goesBy
            .split(" ")
            .map((each, i) => (i === 0 ? `${each[0]}.` : each))
            .join(" ");
      const goesBy = new PIXI.Text(shortened.toUpperCase(), {
        ...basicTextStyle,
        fontSize: 16,
        fontWeight: "600",
        fill: colors.white,
        stroke: colors.black,
        strokeThickness: 3,
        letterSpacing: 0.2,
        dropShadow: false,
      });
      goesBy.position.x += 66;
      goesBy.position.y += 5;
      this.vitalsTextContainer.addChild(goesBy);

      if (this.isFoe) {
        for (const container of [this.vitalBox, this.vitalBoxOver]) {
          if (container) {
            container.scale.x *= -1;
            container.position.x += 460;
          }
        }

        this.vitalsTextContainer.scale.x *= -1;
        this.vitalsTextContainer.position.x += 390;
      } else {
        const job = new PIXI.Text(this.name.toUpperCase(), {
          ...basicTextStyle,
          fontSize: 12,
          fontWeight: "bolder",
          fill: colors.white,
          stroke: colors.black,
          strokeThickness: 3,
          letterSpacing: 0.1,
          dropShadow: false,
        });
        job.position.x += 66;
        job.position.y += 36;
        this.vitalsTextContainer.addChild(job);
      }
    }
  }

  private addBattleMenu() {
    if (this.container && this.battle) {
      this.battleMenu = new BattleMenu(
        this.screen,
        this,
        this.battle,
        this.items,
        () => setTimeout(this.hideVitals.bind(this), 250)
      );
      this.container.addChild(this.battleMenu.wrapper);
    }
  }

  private showVitals = () => {
    if (
      this.container &&
      this.animations &&
      this.vitalBox &&
      this.vitalBoxOver &&
      this.vitalsTextContainer &&
      this.battleMenu
    ) {
      this.vitalBox.visible = true;
      this.vitalBoxOver.visible = true;
      this.vitalsTextContainer.visible = true;

      if (!this.isFoe && this.isReady) {
        this.battleMenu.show();
      }

      this.screen.interactive = true;
      this.screen.on("mousedown", this.hideVitals);
      this.screen.on("touchstart", this.hideVitals);
    }
  };

  private hideVitals = () => {
    if (
      this.animations &&
      this.container &&
      this.vitalBox &&
      this.vitalBoxOver &&
      this.vitalsTextContainer &&
      this.battleMenu
    ) {
      this.vitalBox.visible = false;
      this.vitalBoxOver.visible = false;
      this.vitalsTextContainer.visible = false;

      if (!this.isFoe) {
        this.battleMenu.hide();
      }

      this.screen.interactive = false;
      this.screen.off("mousedown", this.hideVitals);
      this.screen.off("touchstart", this.hideVitals);
    }
  };

  private flashReady() {
    if (this.animations && !this.isFoe) {
      if (this.readyFlashDirection === "in") {
        const isFullyIn =
          this.animations.effects.ready(
            config.ENTITY_READY_FLASH_SPEED,
            this.hasFinaleReady
          ) >= 0.7;

        if (isFullyIn) {
          this.readyFlashDirection = "out";
        }
      } else {
        const isFullyOut =
          this.animations.effects.ready(
            -config.ENTITY_READY_FLASH_SPEED,
            this.hasFinaleReady
          ) === 0;

        if (isFullyOut) {
          this.readyFlashDirection = "in";
        }
      }
    }
  }

  private flashDying() {
    if (
      this.animations &&
      this.animations.animations.dying.alpha > 0 &&
      this.isFoe
    ) {
      this.showAnimation("dying");
      this.animations.effects.die();
    }
  }
}

export class FriendEntity extends BattleEntityWithUI {
  public constructor(_name: EntityKind, _screen: PIXI.Container) {
    super(_name, _screen, "friend", loadJobAnimations);
  }
}
