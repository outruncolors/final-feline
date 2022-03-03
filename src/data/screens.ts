export interface Screen {
  id: number;
  name: ScreenKind;
  title: string;
  description: string;
  animations: string[];
  canVisit?: boolean;
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
  housing: {
    id: 3,
    name: "housing",
    title: "Hyperrealestation",
    description: "Lorem ipsum dolor sit amet.",
    animations: [
      "left-blink",
      "left-talk",
      "look-viewer",
      "right-blink",
      "right-talk",
    ],
  },
  casino: {
    id: 4,
    name: "casino",
    title: "Marseyland",
    description: "Lorem ipsum dolor sit amet.",
    animations: ["left-blink", "right-blink"],
  },
  title: {
    id: 5,
    name: "title",
    title: "Title",
    description: "Lorem ipsum dolor sit amet.",
    animations: ["title"],
    canVisit: false as undefined | false,
  },
};

export type ScreenKind = keyof typeof screens;
