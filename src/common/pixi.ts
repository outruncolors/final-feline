import cloneDeep from "lodash.clonedeep";
import * as PIXI from "pixi.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { contain } from "./contain";
import { keyboard } from "./keyboard";

export const pixiNames = {
  MAIN_SCREEN: "Main Screen",
  HITBOX: "Hitbox",
  WALL: "wall",
  WALL_TOP: "wall-top",
  WALL_CORNER: "wall-corner",
  WALL_TOP_CORNER: "wall-top-corner",
  FLOOR: "floor",
};

export const usePixiApp = (wrapper: Nullable<HTMLElement>) => {
  const [app, setApp] = useState<Nullable<PIXI.Application>>(null);
  const [screen, setScreen] = useState<Nullable<PIXI.Container>>(null);
  const loaded = useRef(false);
  const assetsLoaded = useRef(false);

  // eslint-disable-next-line
  useEffect(() => {
    if (wrapper && !loaded.current) {
      const _app = new PIXI.Application({
        width: document.body.clientWidth,
        height: document.body.clientHeight,
        resizeTo: window,
      });
      wrapper.appendChild(_app.view);

      const _screen = new PIXI.Container();
      _app.stage.addChild(_screen);
      _screen.name = pixiNames.MAIN_SCREEN;
      _screen.width = wrapper.clientWidth;
      _screen.height = wrapper.clientHeight;

      _app.renderer.render(_app.stage);

      loaded.current = true;
      setApp(_app);
      setScreen(_screen);
    }
  });

  return {
    app,
    screen,
    isLoaded: () => loaded.current,
    assetsAreLoaded: () => assetsLoaded.current,
  };
};

export const useCharacterMovement = (
  bootstrapped: boolean,
  screen: Nullable<PIXI.Container>
) => {
  useEffect(() => {
    if (bootstrapped && screen) {
      const heroWalkSheet =
        PIXI.Loader.shared.resources["/assets/textures/hero-walk.json"]
          .spritesheet;

      if (heroWalkSheet) {
        const heroWalkAnimation = new PIXI.AnimatedSprite(
          heroWalkSheet.animations["walk.xml."]
        );
        screen.addChild(heroWalkAnimation);
        heroWalkAnimation.scale.set(0.6);
        heroWalkAnimation.anchor.set(0.5);
        heroWalkAnimation.animationSpeed = 0.8;

        const hitbox = PIXI.Sprite.from(PIXI.Texture.WHITE);
        hitbox.name = pixiNames.HITBOX;
        hitbox.width = 200 * 0.6;
        hitbox.height = 200 * 0.6;
        hitbox.visible = false;
        hitbox.anchor.set(0.5);
        hitbox.position.set(40 * 0.6, 100 * 0.6);
        heroWalkAnimation.addChild(hitbox);
        heroWalkAnimation.hitArea = {
          contains: (x, y) => {
            return hitbox.containsPoint({ x, y });
          },
        };

        const up = keyboard("w"),
          right = keyboard("d"),
          down = keyboard("s"),
          left = keyboard("a");
        const directionKeys = [up, right, down, left];

        let walking: "left" | "none" | "right" = "none";
        let velocity = {
          x: 0,
          y: 0,
        };
        let flipped = false;

        up.press = () => {
          if (!down.isDown) {
            if (walking === "none") {
              walking = "right";
            }
            velocity.y = -8;
          }
        };
        right.press = () => {
          walking = "right";
          velocity.x = 8;
        };
        down.press = () => {
          if (walking === "none") {
            walking = "right";
          }

          velocity.y = 8;
        };
        left.press = () => {
          walking = "left";
          velocity.x = -8;
        };

        const handleWalking = () => {
          if (directionKeys.some((key) => key.isDown)) {
            heroWalkAnimation.play();

            if (
              (walking === "left" && !flipped) ||
              (walking !== "left" && flipped)
            ) {
              heroWalkAnimation.scale.x *= -1;
              flipped = !flipped;
            }
          } else {
            heroWalkAnimation.gotoAndStop(0);
            velocity = {
              x: 0,
              y: 0,
            };
          }

          heroWalkAnimation.position.x += velocity.x;
          heroWalkAnimation.position.y += velocity.y;

          contain(heroWalkAnimation, screen);
        };

        PIXI.Ticker.shared.add(handleWalking);

        return () => {
          screen.removeChild(heroWalkAnimation);
          directionKeys.forEach((key) => key.unsubscribe());
          PIXI.Ticker.shared.remove(handleWalking);
        };
      }
    }
  }, [bootstrapped, screen]);
};

let alreadyLoaded = false;
export const useSpritesheet = () => {
  const [spritesheet, setSpritesheet] =
    useState<Nullable<PIXI.Spritesheet>>(null);

  useEffect(() => {
    if (!spritesheet) {
      if (alreadyLoaded) {
        setSpritesheet(
          PIXI.Loader.shared.resources["/assets/textures/sprites.json"]
            .spritesheet!
        );
      } else {
        if (!PIXI.Loader.shared.loading) {
          new Promise((resolve) => {
            PIXI.Loader.shared
              .add(`/assets/textures/sprites.json`, {
                crossOrigin: "anonymous",
              })
              .load(resolve);
          }).then(() => {
            const sheet =
              PIXI.Loader.shared.resources["/assets/textures/sprites.json"]
                .spritesheet!;
            setSpritesheet(sheet);
          });
        }
      }
    }
  }, [spritesheet]);

  return spritesheet;
};

export type TilesetPiece =
  | "wall"
  | "wall-corner"
  | "wall-top"
  | "wall-top-corner";

export type Tileset = {
  floor: PIXI.Sprite;
} & Record<string, PIXI.Sprite>;

export const useTileset = (name: string) => {
  const spritesheet = useSpritesheet();
  const [tileset, setTileset] = useState<Nullable<Tileset>>(null);

  useEffect(() => {
    if (spritesheet) {
      const tilesetNames = [
        pixiNames.FLOOR,
        pixiNames.WALL,
        pixiNames.WALL_CORNER,
        pixiNames.WALL_TOP,
        pixiNames.WALL_TOP_CORNER,
      ];
      const basicPieces = tilesetNames.reduce((prev, next) => {
        prev[next] = new PIXI.Sprite(
          spritesheet.textures[`tilesets/${name}/${next}`]
        );
        return prev;
      }, {} as Record<string, PIXI.Sprite>);
      const orientations: [keyof Tileset, number][] = [
        ["down", 0],
        ["left", 90],
        ["up", 180],
        ["right", 90],
      ];
      const tileset: Tileset = {
        floor: basicPieces.floor,
      };

      for (const [direction, angle] of orientations) {
        const pieceKinds: TilesetPiece[] = [
          "wall",
          "wall-corner",
          "wall-top",
          "wall-top-corner",
        ];
        const pieces: PIXI.Sprite[] = pieceKinds.map((pieceKind) =>
          PIXI.Sprite.from(basicPieces[pieceKind].texture)
        );

        let i = 0;
        for (const piece of pieces) {
          const clone = PIXI.Sprite.from(piece.texture);
          clone.anchor.set(0.5);
          clone.angle = angle;
          tileset[`${direction}/${pieceKinds[i]}`] = clone;
          i++;
        }
      }

      setTileset(tileset as Tileset);
    }
  }, [name, spritesheet]);

  return tileset;
};

export type RoomTile = {
  piece: string;
};

export type RoomLayout = RoomTile[][];

export const useRoom = (
  tilesetName: string,
  roomLayout: RoomLayout,
  onTileClick?: (x: number, y: number, clone: PIXI.Sprite) => void
) => {
  const tileset = useTileset(tilesetName);
  const [room, setRoom] = useState<Nullable<PIXI.Container>>(null);

  useEffect(() => {
    if (tileset) {
      const _room = new PIXI.Container();

      const cloneReferences: PIXI.Sprite[] = [];
      let i = 0;
      for (const row of roomLayout) {
        const yDistance = i * 128;
        const _row = new PIXI.Container();
        _row.position.y += yDistance;

        let j = 0;
        for (const { piece } of row) {
          let _i = i;
          let _j = j;
          const sprite = tileset[piece];

          if (sprite) {
            const xDistance = j * 128;
            const clone = PIXI.Sprite.from(sprite.texture);
            _row.addChild(clone);
            cloneReferences.push(clone);
            clone.anchor.set(0.5);
            clone.position.x += xDistance;
            clone.interactive = true;
            clone.buttonMode = true;

            if (onTileClick) {
              clone.on("pointerdown", () => {
                onTileClick(_j, _i, clone);
                clone.angle += 90;
              });
            }
          }

          j++;
        }

        _room.addChild(_row);

        i++;
      }

      setRoom(_room);

      return () => {
        for (const clone of cloneReferences) {
          clone.off("pointerdown");
        }
      };
    }
  }, [tileset, roomLayout, onTileClick]);

  return room;
};

const sampleRoom = [
  [
    {
      piece: "down/wall-corner",
      angle: 0,
    },
    {
      piece: "up/wall",
      angle: 0,
    },
    {
      piece: "up/wall",
      angle: 0,
    },
    {
      piece: "up/wall-corner",
      angle: 0,
    },
  ],
];

export const useRoomBuilder = () => {
  const [builder, setBuilder] = useState(sampleRoom);
  const handleTileClick = useCallback(
    (x: number, y: number, clone: PIXI.Sprite) =>
      setBuilder(() => {
        if (builder?.[y]?.[x]) {
          const cloned = cloneDeep(builder);
          cloned[y][x].angle += 90;
          clone.angle += 90;
          return cloned;
        } else {
          return builder;
        }
      }),
    [builder]
  );
  const room = useRoom("bar", sampleRoom, handleTileClick);

  useEffect(() => {
    if (room) {
      setBuilder(sampleRoom);
    }
  }, [room]);

  useEffect(() => {
    console.info("builder) ", builder);
  }, [builder]);

  return {
    room,
    builder: null,
  };
};
