import "./App.css";
import * as PIXI from "pixi.js";
import { useEffect, useRef } from "react";
import { bootstrap } from "./instances";

function App() {
  const mainRef = useRef<null | HTMLElement>(null);
  const app = useRef<null | PIXI.Application>(null);

  useEffect(() => {
    const { current: wrapper } = mainRef;

    if (wrapper && !app.current) {
      app.current = new PIXI.Application({
        width: wrapper.clientWidth,
        height: wrapper.clientHeight,
      });

      wrapper.appendChild(app.current.view);

      bootstrap(app.current);
    }
  });

  return (
    <main ref={mainRef} style={{ width: "100vw", height: "100vh" }}></main>
  );
}

export default App;
