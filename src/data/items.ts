export interface Item {
  id: number;
  name: string;
  description: string;
}

export const items: Record<string, Item> = {
  apple: {
    id: 0,
    name: "apple",
    description: "Just a red apple.",
  },
};

export type ItemKind = keyof typeof items;