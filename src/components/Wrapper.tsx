import * as PIXI from "pixi.js";
import { useEffect, useRef } from "react";
import { ActionBar } from "./ActionBar";
import { SpeechBox } from "./SpeechBox";

interface Props {
  app: PIXI.Application;
}

export function Wrapper({ app }: Props) {
  const wrapper = useRef<null | HTMLDivElement>(null);

  // Effects
  // Bootstrap the app and perform the initial loading process.
  useEffect(() => {
    const _wrapper = wrapper.current;
    _wrapper?.appendChild(app.view);
    return () => {
      _wrapper?.removeChild(app.view);
    };
  });

  return (
    <div ref={wrapper} className="wrapper noselect">
      <SpeechBox />
      <ActionBar />
    </div>
  );
}
