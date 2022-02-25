export interface Item {
  id: number;
  name: string;
  displayName?: string;
  description: string;
}

export const items: Record<string, Item> = {
  fapple: {
    id: 0,
    name: "fapple",
    description: "A feisty apple that restores some HP.",
  },
  "rich-bitch-juice": {
    id: 1,
    name: "rich-bitch-juice",
    displayName: "rich bitch juice",
    description: "A classy beverage for a classy bitch. Restores some MP.",
  },
};

export type ItemKind = keyof typeof items;
