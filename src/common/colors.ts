const colors: Record<string, number> = {
  // Bases
  white: 0xffffff,
  grey: 0x333333,
  black: 0x000000,
  red: 0xff0000,
  green: 0x00ff00,
  blue: 0x0000ff,
  yellow: 0xffa500,
};

export type Color = keyof typeof colors;

// Branded
colors.hp = colors.red;
colors.mp = colors.blue;
colors.atb = colors.white;
colors.finale = colors.yellow;

export { colors }