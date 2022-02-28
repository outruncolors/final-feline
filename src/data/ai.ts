export interface AIConfig {
  frequencies: {
    buff: number; // How often will the AI prioritize buffing itself?
    cast: number; // How often will the AI choose to cast a skill?
  };
  thresholds: {
    escapeAtHP: number; // What percent (from 0.0 to 1.0) of HP will it try to escape?
  };
  behaviors?: {
    canEscape?: boolean; // Will the foe try to escape?
    isRuthless?: boolean; // Specifically targets lowest HP foe.
  };
}

export const ais = {
  basic: {
    frequencies: {
      buff: 1,
      cast: 1,
    },
    thresholds: {
      escapeAtHP: 0.3,
    },
  },
  cautious: {
    frequencies: {
      buff: 1.4,
      cast: 1,
    },
    thresholds: {
      escapeAtHP: 0.6,
    },
    behaviors: {
      canEscape: true,
    },
  },
  reckless: {
    frequencies: {
      buff: 0.6,
      cast: 0.3,
    },
    thresholds: {
      escapeAtHP: 0.1,
    },
    behaviors: {
      isRuthless: true,
    },
  },
};

export type AIKind = keyof typeof ais;
