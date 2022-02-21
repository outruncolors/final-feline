export const allLocations: AllLocations = {
  arena: {
    id: 0,
    name: "arena",
    accessible: false,
  },
  beach: {
    id: 1,
    name: "beach",
  },
  cave: {
    id: 2,
    name: "cave",
  },
  forest: {
    id: 3,
    name: "forest",
  },
  housing: {
    id: 4,
    name: "housing",
    accessible: false,
  },
  market: {
    id: 5,
    name: "market",
    accessible: false,
  },
  mountain: {
    id: 6,
    name: "mountain",
  },
  pub: {
    id: 7,
    name: "pub",
  },
  shop: {
    id: 8,
    name: "shop",
  },
  valley: {
    id: 9,
    name: "valley",
  },
  "world-map": {
    id: 10,
    name: "world-map",
  },
};

export type AllLocations = Record<string, WorldLocation>;
