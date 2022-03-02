export interface Screen {
  id: number;
  name: ScreenKind;
  title: string;
  description: string;
  animations: string[];
}

export const screens = {
  bar: {
    id: 0,
    name: "bar",
    title: "Electric Saturn",
    description: "Lorem ipsum dolor sit amet.",
    animations: ["blink", "blink-talk", "charge", "mad", "talk"],
  },
  shop: {
    id: 1,
    name: "shop",
    title: "The Bare Axe",
    description: "Lorem ipsum dolor sit amet.",
    animations: ["blink", "blink-talk", "caught", "sleep", "talk"],
  },
  tower: {
    id: 2,
    name: "tower",
    title: "The Tower",
    description: "Lorem ipsum dolor sit amet.",
    animations: ["blink", "blink-talk", "jot", "pat", "send", "talk"],
  },
};

export type ScreenKind = keyof typeof screens;
