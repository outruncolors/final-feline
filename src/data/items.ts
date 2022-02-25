export interface Item {
  id: number;
  name: string;
  emoji?: string;
  description: string;
}

export const items: Record<string, Item> = {
  apple: {
    id: 0,
    name: "apple",
    emoji: "🍎",
    description: "Just a red apple.",
  },
};

export type ItemKind = keyof typeof items;
