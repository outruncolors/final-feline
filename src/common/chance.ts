import Chance from "chance";

const CHANCE = new Chance();

export const integer = (min: number, max: number) =>
  CHANCE.integer({ min, max });

export const pickone = CHANCE.pickone.bind(CHANCE);
export const pickset = CHANCE.pickset.bind(CHANCE);
export const n = CHANCE.n.bind(CHANCE);
