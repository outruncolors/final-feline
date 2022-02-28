export interface AIConfig {
  frequencies: {
    buff: number; // How often will the AI prioritize buffing itself?
    cast: number; // How often will the AI choose to cast a skill?
  };
  thresholds: {
    escape: number; // What percent (from 0.0 to 1.0) of HP will it try to escape?
  };
}

export const ais = {
  basic: {
    frequencies: {
      buff: 1,
      cast: 1,
    },
    thresholds: {
      escape: 0.3,
    },
  },
  cautious: {
    frequencies: {
      buff: 1.4,
      cast: 1,
    },
    thresholds: {
      escape: 0.6,
    },
  },
  reckless: {
    frequencies: {
      buff: 0.6,
      cast: 0.3,
    },
    thresholds: {
      escape: 0.1,
    },
  },
};

export type AIKind = keyof typeof ais;
