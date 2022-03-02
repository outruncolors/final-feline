import { useEffect, useRef } from "react";
import { GameState, state as gameState, getChangers } from "./state";
import { loadAssets } from "./common";

export function Wrapper() {
  const state = useRef<GameState>(gameState);
  const wrapper = useRef<null | HTMLDivElement>(null);
  const changers = useRef(getChangers());

  useEffect(() => {
    loadAssets().then(() => {
      const { app } = state.current;
      wrapper.current?.appendChild(app.view);
      changers.current.changeLog("misc", "Appended game screen.");
      changers.current.changeScreen("shop");
    });
  }, []);

  return <div ref={wrapper} />;
}
