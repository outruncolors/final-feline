declare interface EntityAnimations {
  job: string;
  container: PIXI.Container;
  standing: PIXI.AnimatedSprite;
  walking: PIXI.AnimatedSprite;
  attacking: PIXI.AnimatedSprite;
  defending: PIXI.AnimatedSprite;
  dying: PIXI.AnimatedSprite;
}

declare interface WorldLocation {
  id: number;
  name: string;
  accessible?: boolean;
}
