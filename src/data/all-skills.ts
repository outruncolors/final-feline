import type { EntityType } from "../classes";

export const allSkills: AllSkills = {
  subscribe: {
    id: 0,
    name: "subscribe",
    description:
      "Summons a post on a chosen target, dealing physical damage. Has a chance to slow.",
    cost: 5,
    inflicts: ["subscribed", 100],
    offset: [16, 0],
    loopSpeed: 0.2,
    effect(user: EntityType, target: EntityType) {
      // Pass
    },
  },

  "bussy-blasta": {
    id: 1,
    name: "bussy-blasta",
    description: "",
    cost: 5,
    loopCount: 3,
    loopSpeed: 0.2,
    inflicts: ["charmed", 100],
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
    offset: [-156, 0],
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
    inflicts: ["upvoted", 100],
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
    loopCount: 3,
    loopSpeed: 0.2,
    inflicts: ["upvoted", 100],
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
    inflicts: ["upvoted", 100],
    effect(user: EntityType, targets: EntityType) {
      // Pass
    },
  },

  bait: {
    id: 9,
    name: "bait",
    description: "Causes the chosen target to only be able to target the user.",
    cost: 5,
    inflicts: ["baited", 100],
    effect(user: EntityType, target: EntityType) {
      // Pass
    },
  },

  troll: {
    id: 10,
    name: "troll",
    description: "Causes the chosen target to often miss when attacking.",
    cost: 5,
    offset: [0, 64],
    inflicts: ["trolled", 100],
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
    loopCount: 7,
    loopSpeed: 0.5,
    inflicts: ["followed", 100],
    effect(user: EntityType, target: EntityType) {
      // Pass
    },
  },

  downvote: {
    id: 12,
    name: "downvote",
    description: "Lowers all of a chosen target's stats by a moderate amount.",
    cost: 5,
    inflicts: ["downvoted", 100],
    effect(user: EntityType, target: EntityType) {
      // Pass
    },
  },

  block: {
    id: 13,
    name: "block",
    description: "Prevents the target from targetting the user.",
    cost: 5,
    inflicts: ["blocked", 100],
    effect(user: EntityType, target: EntityType) {
      // Pass
    },
  },

  report: {
    id: 14,
    name: "report",
    description: "Renders the target unable to use skills.",
    cost: 5,
    offset: [0, 32],
    inflicts: ["reported", 100],
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
    offset: [-20, 0],
    inflicts: ["pinned", 100],
    effect(user: EntityType, target: EntityType) {
      // Pass
    },
  },

  delete: {
    id: 16,
    name: "delete",
    description: "Deals immense physical damage, lowers enemy ATB to 0.",
    cost: 5,
    inflicts: ["deleted", 100],
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
    offset: [-64, 0],
    loopSpeed: 0.2,
    inflicts: ["shadowbanned", 100],
    effect(user: EntityType, target: EntityType) {
      // Pass
    },
  },
};

export type AllSkills = Record<string, EntitySkill>;
