import type { EntityType } from "../classes";

export const allSkills: AllSkills = {
  seriouspost: {
    id: 0,
    name: "seriouspost",
    description:
      "Summons a post on a chosen target, dealing physical damage. Has a chance to slow.",
    cost: 5,
    effect(user: EntityType, target: EntityType) {
      // Pass
    },
  },

  metapost: {
    id: 1,
    name: "metapost",
    description:
      "Summons a series of 2-4 self-referential posts that randomly target enemies for physical damage.",
    cost: 5,
    effect(user: EntityType, target: EntityType) {
      // Pass
    },
  },

  longpost: {
    id: 2,
    name: "longpost",
    description:
      "Summons a single huge post on the chosen target, dealing immense physical damage.",
    cost: 5,
    effect(user: EntityType, target: EntityType) {
      // Pass
    },
  },

  spam: {
    id: 3,
    name: "spam",
    description:
      "Attacks the enemy team with a serious of non-sequiturs, dealing physical damage.",
    multi: true,
    cost: 5,
    effect(user: EntityType, targets: EntityType[]) {
      // Pass
    },
  },

  flame: {
    id: 4,
    name: "flame",
    description:
      "Attacks the enemy team with vicious, burning insults, dealing magic damage.",
    multi: true,
    cost: 5,
    effect(user: EntityType, targets: EntityType[]) {
      // Pass
    },
  },

  flood: {
    id: 5,
    name: "flood",
    description:
      "Drowns the enemy team in wave after wave of text, dealing immense magic damage.",
    multi: true,
    cost: 5,
    effect(user: EntityType, targets: EntityType[]) {
      // Pass
    },
  },

  upvote: {
    id: 6,
    name: "upvote",
    description:
      "Expresses appreciation for an ally, increasing their speed and recovery.",
    cost: 5,
    friendly: true,
    effect(user: EntityType, target: EntityType) {
      // Pass
    },
  },

  award: {
    id: 7,
    name: "award",
    description:
      "Grants a valuable award to an ally, increasing all of their stats.",
    cost: 5,
    effect(user: EntityType, target: EntityType) {
      // Pass
    },
  },

  gem: {
    id: 8,
    name: "gem",
    description:
      "Summons a fascinating gem, inspiring the team and allowing allies to critically strike.",
    cost: 5,
    friendly: true,
    multi: true,
    effect(user: EntityType, targets: EntityType) {
      // Pass
    },
  },

  bait: {
    id: 9,
    name: "bait",
    description: "Causes the chosen target to only be able to target the user.",
    cost: 5,
    effect(user: EntityType, target: EntityType) {
      // Pass
    },
  },

  troll: {
    id: 10,
    name: "troll",
    description: "Causes the chosen target to often miss when attacking.",
    cost: 5,
    effect(user: EntityType, target: EntityType) {
      // Pass
    },
  },

  follow: {
    id: 11,
    name: "follow",
    description:
      "Automatically performs an attack on the target whenever the target takes their turn.",
    cost: 5,
    effect(user: EntityType, target: EntityType) {
      // Pass
    },
  },

  downvote: {
    id: 12,
    name: "downvote",
    description: "Lowers all of a chosen target's stats by a moderate amount.",
    cost: 5,
    effect(user: EntityType, target: EntityType) {
      // Pass
    },
  },

  block: {
    id: 13,
    name: "block",
    description: "Prevents the target from targetting the user.",
    cost: 5,
    effect(user: EntityType, target: EntityType) {
      // Pass
    },
  },

  report: {
    id: 14,
    name: "report",
    description: "Renders the target unable to use skills.",
    cost: 5,
    effect(user: EntityType, target: EntityType) {
      // Pass
    },
  },

  pin: {
    id: 15,
    name: "pin",
    description:
      "Deals moderate physical damage ad increases damage from other sources by a moderate amount.",
    cost: 5,
    effect(user: EntityType, target: EntityType) {
      // Pass
    },
  },

  delete: {
    id: 16,
    name: "delete",
    description: "Deals immense physical damage, lowers enemy ATB to 0.",
    cost: 5,
    effect(user: EntityType, target: EntityType) {
      // Pass
    },
  },

  shadowban: {
    id: 17,
    name: "shadowban",
    description:
      "Deals immense physical damage, lowers HP by damage dealt for duration of battle.",
    cost: 5,
    effect(user: EntityType, target: EntityType) {
      // Pass
    },
  },
};

export type AllSkills = Record<string, EntitySkill>;