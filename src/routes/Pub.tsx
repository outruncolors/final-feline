import { useRef } from "react";

export const Pub = () => {
  const mainRef = useRef<null | HTMLElement>(null);

  return (
    <main ref={mainRef} style={{ width: "100vw", height: "100vh" }}></main>
  );
};
