import * as PIXI from "pixi.js";
import { Menu } from "../Menu";
import { SkillKind, skills } from '../../../data';
import type { BattleEntity } from "../../Entity";

export class CastMenu extends Menu {
  constructor(_screen: PIXI.Container, _entity: BattleEntity) {
    const actions = _entity.baseSkills.map(value => skills[value]).map(skill => {
      return {
        title: skill.name,
        onInteraction: () => {
          _entity.cast(skill.name as SkillKind, _entity);
        }
      }
    })

    const menuConfig = {
      fontSize: 14,
      prompt:
        "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tUse which skill?".toUpperCase(),
      containerXOffset: 140,
      containerYOffset: 182,
      boxYOffset: 3,
      width: 530,
      height: 60,
      actions
    };

    super(_screen, menuConfig);
  }
}
