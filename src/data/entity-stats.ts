import { allFoes } from "./all-foes";

const fromFoes = Object.entries(allFoes).reduce((prev, next) => {
  const [name, { stats }] = next;
  prev[name] = stats;
  return prev;
}, {} as Record<string, EntityStats>);

export const entityStats: Record<string, EntityStats> = {
  dramanaut: {
    STR: [7, 14, 21],
    AGI: [5, 10, 15],
    MAG: [4, 8, 12],
    STA: [6, 12, 18],
    HP: [120, 160, 200],
    MP: [8, 16, 24],
    ATB: 50,
  },
  copamancer: {
    STR: [5, 10, 15],
    AGI: [6, 12, 18],
    MAG: [7, 14, 21],
    STA: [4, 8, 12],
    HP: [80, 120, 160],
    MP: [21, 42, 63],
    ATB: 60,
  },
  seethesayer: {
    STR: [4, 8, 12],
    AGI: [5, 10, 15],
    MAG: [7, 14, 21],
    STA: [6, 12, 18],
    HP: [100, 140, 180],
    MP: [18, 36, 54],
    ATB: 50,
  },
  dilationist: {
    STR: [6, 12, 18],
    AGI: [7, 14, 21],
    MAG: [4, 8, 12],
    STA: [5, 10, 15],
    HP: [90, 130, 170],
    MP: [10, 15, 20],
    ATB: 70,
  },
  maldician: {
    STR: [5, 10, 15],
    AGI: [4, 8, 12],
    MAG: [7, 14, 21],
    STA: [6, 12, 18],
    HP: [70, 100, 130],
    MP: [28, 56, 84],
    ATB: 40,
  },
  janninator: {
    STR: [7, 14, 21],
    AGI: [4, 8, 12],
    MAG: [5, 10, 15],
    STA: [6, 12, 18],
    HP: [105, 150, 195],
    MP: [12, 24, 36],
    ATB: 40,
  },
  ...fromFoes,
};
