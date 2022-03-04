import { GiTvTower, GiRingedPlanet, GiSharpAxe, GiHouse } from "react-icons/gi";
import { MdCasino, MdTitle } from "react-icons/md";
import { IconType } from "react-icons/lib";

export interface Screen {
  id: number;
  name: ScreenKind;
  title: string;
  description: string;
  animations: string[];
  initialAnimation: string;
  canVisit?: boolean;
  Icon: IconType;
}

export const screens = {
  bar: {
    id: 0,
    name: "bar",
    title: "Electric Saturn",
    description: "Lorem ipsum dolor sit amet.",
    animations: ["blink", "blink-talk", "charge", "mad", "talk"],
    initialAnimation: "talk",
    Icon: GiRingedPlanet,
  },
  shop: {
    id: 1,
    name: "shop",
    title: "The Bare Axe",
    description: "Lorem ipsum dolor sit amet.",
    animations: ["blink", "blink-talk", "caught", "sleep", "talk"],
    initialAnimation: "talk",
    Icon: GiSharpAxe,
  },
  tower: {
    id: 2,
    name: "tower",
    title: "The Tower",
    description: "Lorem ipsum dolor sit amet.",
    animations: ["blink", "blink-talk", "jot", "pat", "send", "talk"],
    initialAnimation: "talk",
    Icon: GiTvTower,
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
    initialAnimation: "left-talk",
    Icon: GiHouse,
  },
  casino: {
    id: 4,
    name: "casino",
    title: "Marseyland",
    description: "Lorem ipsum dolor sit amet.",
    animations: ["left-blink", "right-blink"],
    initialAnimation: "right-blink",
    Icon: MdCasino,
  },
  title: {
    id: 5,
    name: "title",
    title: "Title",
    description: "Lorem ipsum dolor sit amet.",
    animations: ["title"],
    initialAnimation: "title",
    canVisit: false as undefined | false,
    Icon: MdTitle,
  },
  city: {
    id: 6,
    name: "city",
    title: "City",
    description: "Lorem ipsum dolor sit amet.",
    animations: ["bar", "casino", "housing", "intro", "shop", "tower"],
    initialAnimation: "intro",
    Icon: MdTitle,
  },
};

export type ScreenKind = keyof typeof screens;
