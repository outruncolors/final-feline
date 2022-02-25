import * as PIXI from "pixi.js";
import { SkillKind } from "../../../data";
import type { BattleEntity } from "../../Entity";
import { Menu } from "../Menu";

export class CastMenu extends Menu {
  constructor(
    _screen: PIXI.Container,
    _entity: BattleEntity,
    _onSelectSkill: (kind: SkillKind) => void
  ) {
    const actions = _entity.baseSkills.map((skill) => ({
      title: skill,
      onInteraction: () => _onSelectSkill(skill),
    }));

    const menuConfig = {
      fontSize: 14,
      prompt:
        "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tUse which skill?".toUpperCase(),
      containerXOffset: 140,
      containerYOffset: 182,
      boxYOffset: 3,
      width: 530,
      height: 60,
      actions,
      vertical: true
    };

    super(_screen, menuConfig);
  }
}
