import Chance from "chance";
import type { BattleEntity } from "../classes";
import { config } from "../common";

const CHANCE = new Chance();

export interface Item {
  id: number;
  name: string;
  displayName?: string;
  description: string;
  effect: (
    user: BattleEntity,
    target: BattleEntity
  ) => void | ((user: BattleEntity, targets: BattleEntity[]) => void);
}

export const items: Record<string, Item> = {
  fapple: {
    id: 0,
    name: "fapple",
    description: "A feisty apple that restores some HP.",
    effect: (_, target) => {
      const [min, max] = config.FAPPLE_HP_RECOVERY;
      target.recoverHP(CHANCE.integer({ min, max }));
    },
  },
  "rich-bitch-juice": {
    id: 1,
    name: "rich-bitch-juice",
    displayName: "rich bitch juice",
    description: "A classy beverage for a classy bitch. Restores some MP.",
    effect: (_, target) => {
      const [min, max] = config.RICH_BITCH_JUICE_MP_RECOVERY;
      target.recoverMP(CHANCE.integer({ min, max }));
    },
  },
};

export type ItemKind = keyof typeof items;
