export const allEffects: AllEffects = {
  baited: {
    id: 0,
    name: "baited",
    description: "",
  },
  blocked: {
    id: 1,
    name: "blocked",
    description: "",
  },
  charmed: {
    id: 2,
    name: "charmed",
    description: "",
  },
  deleted: {
    id: 3,
    name: "deleted",
    description: "",
  },
  downvoted: {
    id: 4,
    name: "downvoted",
    description: "",
  },
  followed: {
    id: 5,
    name: "followed",
    description: "",
  },
  pinned: {
    id: 6,
    name: "pinned",
    description: "",
  },
  reported: {
    id: 7,
    name: "reported",
    description: "",
  },
  shadowbanned: {
    id: 8,
    name: "shadowbanned",
    description: "",
  },
  trolled: {
    id: 9,
    name: "trolled",
    description: "",
  },
  upvoted: {
    id: 10,
    name: "upvoted",
    description: "",
  },
};

export type AllEffects = Record<string, Effect>;
