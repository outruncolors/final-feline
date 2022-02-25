import * as PIXI from "pixi.js";
import { Menu } from "../Menu";
import { TargetMenu } from "./TargetMenu";
import { Skill, SkillKind, skills } from "../../../data";
import type { BattleEntity } from "../../Entity";
import type { BattleStatus } from "../../Battle";

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
    };

    super(_screen, menuConfig);
  }
}
