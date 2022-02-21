export interface Affliction {
  id: number;
  name: string;
  description: string;
  loopSpeed?: number;
  offset?: [number, number];
}

export const afflictions = {
  baited: {
    id: 0,
    name: "baited",
    description: "Lorem ipsum dolor sit amet.",
  },
  blocked: {
    id: 1,
    name: "blocked",
    description: "Lorem ipsum dolor sit amet.",
  },
  charmed: {
    id: 2,
    name: "charmed",
    description: "Lorem ipsum dolor sit amet.",
  },
  deleted: {
    id: 3,
    name: "deleted",
    description: "Lorem ipsum dolor sit amet.",
  },
  downvoted: {
    id: 4,
    name: "downvoted",
    description: "Lorem ipsum dolor sit amet.",
  },
  followed: {
    id: 5,
    name: "followed",
    description: "Lorem ipsum dolor sit amet.",
  },
  pinned: {
    id: 6,
    name: "pinned",
    description: "Lorem ipsum dolor sit amet.",
  },
  reported: {
    id: 7,
    name: "reported",
    description: "Lorem ipsum dolor sit amet.",
  },
  shadowbanned: {
    id: 8,
    name: "shadowbanned",
    description: "Lorem ipsum dolor sit amet.",
  },
  subscribed: {
    id: 11,
    name: "subscribed",
    description: "Lorem ipsum dolor sit amet.",
  },
  trolled: {
    id: 9,
    name: "trolled",
    description: "Lorem ipsum dolor sit amet.",
  },
  upvoted: {
    id: 10,
    name: "upvoted",
    description: "Lorem ipsum dolor sit amet.",
  },
};

export type AfflictionKind = keyof typeof afflictions;
