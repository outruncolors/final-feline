import { allFoes } from "./all-foes";

const fromFoes = Object.entries(allFoes).reduce((prev, next) => {
  const [name, { skills }] = next;
  prev[name] = skills;
  return prev;
}, {} as Record<string, string[]>);

export const entitySkills: Record<string, string[]> = {
  dramanaut: ["subscribe", "bussy-blasta", "longpost"],
  copamancer: ["spam", "flame", "flood"],
  seethesayer: ["upvote", "award", "gem"],
  dilationist: ["bait", "troll", "follow"],
  maldician: ["downvote", "block", "report"],
  janninator: ["pin", "delete", "shadowban"],
  ...fromFoes,
};
