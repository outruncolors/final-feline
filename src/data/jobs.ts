import type { EntityStats } from "./entities";
import type { SkillKind } from "./skills";

export interface Job {
  id: number;
  name: string;
  description: string;
  stats: EntityStats;
  skills: SkillKind[];
}

export const jobs = {
  dramanaut: {
    id: 0,
    name: "Dramanaut",
    description: "Lorem ipsum dolor sit amet.",
    stats: {
      STR: [7, 14, 21],
      AGI: [5, 10, 15],
      MAG: [4, 8, 12],
      STA: [6, 12, 18],
      HP: [120, 160, 200],
      MP: [8, 16, 24],
      ATB: 50,
    },
    skills: ["subscribe", "bussy-blasta", "longpost"] as SkillKind[],
  },
  copamancer: {
    id: 1,
    name: "Copamancer",
    description: "Lorem ipsum dolor sit amet.",
    stats: {
      STR: [5, 10, 15],
      AGI: [6, 12, 18],
      MAG: [7, 14, 21],
      STA: [4, 8, 12],
      HP: [80, 120, 160],
      MP: [21, 42, 63],
      ATB: 60,
    },
    skills: ["spam", "flame", "flood"] as SkillKind[],
  },
  seethesayer: {
    id: 2,
    name: "Seethesayer",
    description: "Lorem ipsum dolor sit amet.",
    stats: {
      STR: [4, 8, 12],
      AGI: [5, 10, 15],
      MAG: [7, 14, 21],
      STA: [6, 12, 18],
      HP: [100, 140, 180],
      MP: [18, 36, 54],
      ATB: 50,
    },
    skills: ["upvote", "award", "gem"] as SkillKind[],
  },
  dilationist: {
    id: 3,
    name: "Dilationist",
    description: "Lorem ipsum dolor sit amet.",
    stats: {
      STR: [6, 12, 18],
      AGI: [7, 14, 21],
      MAG: [4, 8, 12],
      STA: [5, 10, 15],
      HP: [90, 130, 170],
      MP: [10, 15, 20],
      ATB: 70,
    },
    skills: ["bait", "troll", "follow"] as SkillKind[],
  },
  maldician: {
    id: 4,
    name: "Maldician",
    description: "Lorem ipsum dolor sit amet.",
    stats: {
      STR: [5, 10, 15],
      AGI: [4, 8, 12],
      MAG: [7, 14, 21],
      STA: [6, 12, 18],
      HP: [70, 100, 130],
      MP: [28, 56, 84],
      ATB: 40,
    },
    skills: ["downvote", "block", "report"] as SkillKind[],
  },
};

export type JobKind = keyof typeof jobs;
