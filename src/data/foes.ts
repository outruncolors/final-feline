import type { AIKind } from "./ai";
import type { EntityStats } from "./entities";
import type { SkillKind } from "./skills";

export interface Foe {
  id: number;
  name: string;
  description: string;
  stats: EntityStats;
  skills: SkillKind[];
  flipped?: boolean;
  buff?: SkillKind;
  canEscape?: boolean;
  ai: AIKind;
}

export const foes = {
  lolcow: {
    id: 0,
    name: "Lolcow",
    description: "Lorem ipsum dolor sit amet.",
    stats: {
      STR: [7, 14, 21],
      AGI: [5, 10, 15],
      MAG: [4, 8, 12],
      STA: [6, 12, 18],
      HP: [120, 160, 200],
      MP: [8, 16, 24],
      ATB: 50,
      FIN: 0,
    },
    skills: ["downvote"] as SkillKind[],
    ai: "basic",
  },
  macey: {
    id: 7,
    name: "Macey",
    description: "Lorem ipsum dolor sit amet.",
    stats: {
      STR: [7, 14, 21],
      AGI: [5, 10, 15],
      MAG: [4, 8, 12],
      STA: [6, 12, 18],
      HP: [120, 160, 200],
      MP: [8, 16, 24],
      ATB: 50,
      FIN: 0,
    },
    skills: ["downvote"] as SkillKind[],
    ai: "basic",
  },
  mimic: {
    id: 1,
    name: "Mimic",
    description: "Lorem ipsum dolor sit amet.",
    stats: {
      STR: [7, 14, 21],
      AGI: [5, 10, 15],
      MAG: [4, 8, 12],
      STA: [6, 12, 18],
      HP: [120, 160, 200],
      MP: [8, 16, 24],
      ATB: 50,
      FIN: 0,
    },
    skills: ["downvote"] as SkillKind[],
    ai: "basic",
  },
  npcat: {
    id: 2,
    name: "NPCat",
    description: "Lorem ipsum dolor sit amet.",
    stats: {
      STR: [7, 14, 21],
      AGI: [5, 10, 15],
      MAG: [4, 8, 12],
      STA: [6, 12, 18],
      HP: [120, 160, 200],
      MP: [8, 16, 24],
      ATB: 50,
      FIN: 0,
    },
    skills: ["downvote"] as SkillKind[],
    ai: "basic",
    canEscape: true,
  },
  shapehero: {
    id: 8,
    name: "Shapehero",
    description: "Lorem ipsum dolor sit amet.",
    stats: {
      STR: [7, 14, 21],
      AGI: [5, 10, 15],
      MAG: [4, 8, 12],
      STA: [6, 12, 18],
      HP: [120, 160, 200],
      MP: [8, 16, 24],
      ATB: 50,
      FIN: 0,
    },
    skills: ["downvote"] as SkillKind[],
    ai: "basic",
  },
  soylamander: {
    id: 3,
    name: "Soylamander",
    description: "Lorem ipsum dolor sit amet.",
    stats: {
      STR: [7, 14, 21],
      AGI: [5, 10, 15],
      MAG: [4, 8, 12],
      STA: [6, 12, 18],
      HP: [120, 160, 200],
      MP: [8, 16, 24],
      ATB: 50,
      FIN: 0,
    },
    skills: ["downvote"] as SkillKind[],
    ai: "basic",
  },
  soynail: {
    id: 4,
    name: "Soynail",
    description: "Lorem ipsum dolor sit amet.",
    stats: {
      STR: [7, 14, 21],
      AGI: [5, 10, 15],
      MAG: [4, 8, 12],
      STA: [6, 12, 18],
      HP: [120, 160, 200],
      MP: [8, 16, 24],
      ATB: 50,
      FIN: 0,
    },
    skills: ["downvote"] as SkillKind[],
    ai: "basic",
  },
  soynake: {
    id: 5,
    name: "Soynake",
    description: "Lorem ipsum dolor sit amet.",
    stats: {
      STR: [7, 14, 21],
      AGI: [5, 10, 15],
      MAG: [4, 8, 12],
      STA: [6, 12, 18],
      HP: [120, 160, 200],
      MP: [8, 16, 24],
      ATB: 50,
      FIN: 0,
    },
    skills: ["downvote"] as SkillKind[],
    ai: "basic",
  },
  soyvyrn: {
    id: 6,
    name: "Soyvyrn",
    description: "Lorem ipsum dolor sit amet.",
    stats: {
      STR: [7, 14, 21],
      AGI: [5, 10, 15],
      MAG: [4, 8, 12],
      STA: [6, 12, 18],
      HP: [120, 160, 200],
      MP: [8, 16, 24],
      ATB: 50,
      FIN: 0,
    },
    skills: ["downvote"] as SkillKind[],
    ai: "basic",
  },
};

export type FoeKind = keyof typeof foes;
