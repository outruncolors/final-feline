import { useEffect, useRef } from "react";
import { GameState, state as gameState, getChangers } from "./state";

export function Wrapper() {
  const state = useRef<GameState>(gameState);
  const wrapper = useRef<null | HTMLDivElement>(null);
  const changers = useRef(getChangers());

  useEffect(() => {
    const { app } = state.current;
    wrapper.current?.appendChild(app.view);
    changers.current.changeLog("misc", "Appended game screen.");
  }, []);

  return <div ref={wrapper} />;
}
