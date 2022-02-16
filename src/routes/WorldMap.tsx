import { sound } from "@pixi/sound";

import { useEffect, useRef } from "react";
import { registry } from "../instances";
import { useInstance } from "../common";

export const WorldMap = () => {
  const mainRef = useRef<null | HTMLElement>(null);

  useInstance(mainRef.current, registry);

  useEffect(() => {
    sound.stopAll();
  }, []);

  return (
    <main ref={mainRef} style={{ width: "100vw", height: "100vh" }}></main>
  );
};
