import * as PIXI from "pixi.js";
import { useEffect, useRef, useState } from "react";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import { bootstrap } from "./bootstrap";

export const useInstance = (
  container: null | HTMLElement,
  registry: Record<
    string,
    (
      app: PIXI.Application,
      screen: PIXI.Container,
      navigator: NavigateFunction
    ) => void
  >
) => {
  const app = useRef<null | PIXI.Application>(null);
  const location = useLocation();
  const navigator = useNavigate();
  const [, setState] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setState((prev) => prev + 1);
    });
  }, []);

  useEffect(() => {
    if (container && !app.current) {
      app.current = new PIXI.Application({
        width: container.scrollWidth,
        height: container.scrollHeight,
      });

      container.appendChild(app.current.view);

      const initializer = registry[location.pathname];

      if (initializer) {
        bootstrap(app.current, initializer, navigator);
      }
    }
  });
};
