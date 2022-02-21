declare interface EntityAnimations {
  container: PIXI.Container;
  standing: PIXI.AnimatedSprite;
  walking: PIXI.AnimatedSprite;
  attacking: PIXI.AnimatedSprite;
  defending: PIXI.AnimatedSprite;
  dying: PIXI.AnimatedSprite;
}

declare type EntityAnimationLoader = (key: string) => EntityAnimations;

declare interface EntityStats {
  STR: number[];
  AGI: number[];
  MAG: number[];
  STA: number[];
  HP: number[];
  MP: number[];
  ATB: number;
}

declare type StatName = keyof EntityStats;

declare interface EntitySkill {
  id: number;
  name: string;
  description: string;
  friendly?: boolean;
  multi?: boolean;
  cost: number;
  loopCount?: number;
  loopSpeed?: number;
  offset?: [number, number];
  inflicts?: [string, number];
  effect: (
    user: any,
    target: any
  ) => void | ((user: any, targets: any[]) => void);
}

declare interface WorldLocation {
  id: number;
  name: string;
  accessible?: boolean;
}

declare interface Effect {
  id: number;
  name: string;
  description: string;
  loopSpeed?: number;
  offset?: [number, number];
}
