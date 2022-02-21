export interface Foe {
  id: number;
  name: string;
  description: string;
  stats: EntityStats;
  skills: string[];
}

export const allFoes: Record<string, Foe> = {
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
    },
    skills: ["downvote"],
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
    },
    skills: ["downvote"],
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
    },
    skills: ["downvote"],
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
    },
    skills: ["downvote"],
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
    },
    skills: ["downvote"],
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
    },
    skills: ["downvote"],
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
    },
    skills: ["downvote"],
  },
};

export type AllFoes = typeof allFoes;
