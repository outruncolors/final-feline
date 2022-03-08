import { useEffect, useState } from "react";
import * as PIXI from "pixi.js";
import { pixiNames, useSpritesheet } from "./pixi";

export type TilesetPiece =
  | "wall"
  | "wall-corner"
  | "wall-top"
  | "wall-top-corner";

export type Tileset = {
  floor: PIXI.Sprite;
} & Record<string, PIXI.Sprite>;

export const tilesetNames = [
  pixiNames.FLOOR,
  pixiNames.WALL,
  pixiNames.WALL_CORNER,
  pixiNames.WALL_TOP,
  pixiNames.WALL_TOP_CORNER,
];

export const useTileset = (name: string) => {
  const spritesheet = useSpritesheet();
  const [tileset, setTileset] = useState<Nullable<Tileset>>(null);

  useEffect(() => {
    if (spritesheet) {
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
        ["right", 270],
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

type FacingDirection = "down" | "left" | "up" | "right";

const amountOfTimes = <T>(times: number, thing: T) =>
  Array.from({ length: times }, () => thing);

const generateWallTopOfLength = (facing: FacingDirection, length: number) =>
  amountOfTimes(length, {
    piece: `${facing}/wall-top`,
  });

const generateWallOfLength = (facing: FacingDirection, length: number) =>
  amountOfTimes(length, {
    piece: `${facing}/wall`,
  });

const generateFloorOfLength = (length: number) =>
  amountOfTimes(length, {
    piece: "floor",
  });

const generateRoomRows = (width: number, amount: number) =>
  amountOfTimes(amount, generateRoomCenter(width));

export const generateRoomTop = (width: number) => [
  [
    {
      piece: `right/wall-top-corner`,
    },
    ...generateWallTopOfLength("down", width + 2),
    {
      piece: `down/wall-top-corner`,
    },
  ],
  [
    {
      piece: "right/wall-top",
    },
    {
      piece: `right/wall-corner`,
    },
    ...generateWallOfLength("down", width),
    {
      piece: `down/wall-corner`,
    },
    {
      piece: "left/wall-top",
    },
  ],
];

export const generateRoomCenter = (width: number) => [
  {
    piece: "right/wall-top",
  },
  {
    piece: "right/wall",
  },
  ...generateFloorOfLength(width),
  {
    piece: "left/wall",
  },
  {
    piece: "left/wall-top",
  },
];

export const generateRoomBottom = (width: number) => [
  [
    {
      piece: `right/wall-top`,
    },
    {
      piece: `up/wall-corner`,
    },
    ...generateWallOfLength("up", width),
    {
      piece: `left/wall-corner`,
    },
    {
      piece: `left/wall-top`,
    },
  ],
  [
    {
      piece: `up/wall-top-corner`,
    },
    ...generateWallTopOfLength("up", width + 2),
    {
      piece: `left/wall-top-corner`,
    },
  ],
];

export const generateRoomShell = (width: number, height: number) => {
  const shell = [
    ...generateRoomTop(width),
    ...generateRoomRows(width, height),
    ...generateRoomBottom(width),
  ];

  return shell;
};

export const useRoom = (
  tilesetName: string,
  roomLayout: RoomLayout,
  onEachSprite?: (sprite: PIXI.Sprite) => void
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
          const sprite = tileset[piece];

          if (sprite) {
            const xDistance = j * 128;
            const clone = PIXI.Sprite.from(sprite.texture);
            _row.addChild(clone);
            cloneReferences.push(clone);
            clone.anchor.set(0.5);
            clone.position.x += xDistance;
            clone.angle = determineAngleFromName(piece);

            onEachSprite?.(clone);
          }

          j++;
        }

        _room.addChild(_row);

        i++;
      }

      setRoom(_room);
    }
  }, [tileset, roomLayout, onEachSprite]);

  return room;
};

const determineAngleFromName = (name: string) => {
  if (name.includes("left")) {
    return 90;
  } else if (name.includes("up")) {
    return 180;
  } else if (name.includes("right")) {
    return 270;
  } else {
    return 0;
  }
};
