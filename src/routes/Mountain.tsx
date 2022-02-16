import { useRef } from "react";
import { registry } from "../instances";
import { useInstance } from "../common";

export const Mountain = () => {
  const mainRef = useRef<null | HTMLElement>(null);

  useInstance(mainRef.current, registry);

  return (
    <main ref={mainRef} style={{ width: "100vw", height: "100vh" }}></main>
  );
};
