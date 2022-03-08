import { FormEvent, useCallback, useRef } from "react";
import { RoomLayout, RoomTile, tilesetNames } from "../common";

interface Props {
  width: number;
  height: number;
  onSubmit(layout: RoomLayout): void;
}

export const RoomForm = ({ width, height, onSubmit }: Props) => {
  const formRef = useRef<Nullable<HTMLFormElement>>(null);
  const generateLayout = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (formRef.current) {
        const form = formRef.current;
        const layout: RoomLayout = [];

        for (let i = 0; i < height; i++) {
          const row: RoomTile[] = [];

          for (let j = 0; j < width; j++) {
            const tileSelect = form.querySelector(
              `select[name="tile_${i}_${j}"]`
            ) as HTMLSelectElement;
            const piece = tileSelect.value;

            row.push({
              piece,
            });
          }
          layout.push(row);
        }

        onSubmit(layout);
      }
    },
    [width, height, onSubmit]
  );

  return (
    <form ref={formRef} onSubmit={generateLayout}>
      {Array.from({ length: height }, (_, rowIndex) => (
        <fieldset style={{ display: "flex", alignItems: "center" }}>
          {Array.from({ length: width }, (_, columnIndex) => (
            <div key={`${rowIndex}_${columnIndex}`}>
              <select name={`tile_${rowIndex}_${columnIndex}`}>
                {["down", "left", "up", "right"]
                  .reduce(
                    (prev, next) => {
                      for (const tileKind of tilesetNames) {
                        if (tileKind !== "floor") {
                          prev.push(`${next}/${tileKind}`);
                        }
                      }

                      return prev;
                    },
                    ["floor"]
                  )
                  .map((tileKind) => (
                    <option key={tileKind} value={tileKind}>
                      {tileKind}
                    </option>
                  ))}
              </select>
            </div>
          ))}
        </fieldset>
      ))}

      <button type="submit">Send</button>
    </form>
  );
};
