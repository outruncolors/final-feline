import * as PIXI from "pixi.js";
import locationTextures from "../data/locations.json";

export const getLocationSprite = (locationName: string) => {
  const entry = locationTextures.frames.find(({ filename }) =>
    filename.startsWith(locationName)
  );

  if (entry) {
    const texture = PIXI.utils.TextureCache["/assets/images/locations.png"];
    const { x, y, w, h } = entry.frame;
    const rectangle = new PIXI.Rectangle(x, y, w, h);

    texture.frame = rectangle;

    const screen = new PIXI.Sprite(texture);

    return screen;
  } else {
    throw new Error(`Unable to find location sprite for ${locationName}`);
  }
};
