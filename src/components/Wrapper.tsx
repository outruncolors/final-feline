import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { beginTrackingTicks, state } from "../state";
import { loadAssets } from "../common";
import { ActionBar } from "./ActionBar";
import { SpeechBox } from "./SpeechBox";

export const Wrapper = observer(() => {
  const wrapper = useRef<null | HTMLDivElement>(null);

  // Effects
  // Bootstrap the app and perform the initial loading process.
  useEffect(() => {
    const setup = () => {
      const { app } = state;
      wrapper.current?.appendChild(app.view);

      beginTrackingTicks();

      state.screen.which = "title";
      state.dialogue.push({
        name: "bob",
        avatar: "bob",
        text: " hey",
      });
    };

    loadAssets().then(setup).catch(setup);
  }, []);

  return (
    <div ref={wrapper} className="wrapper noselect">
      <SpeechBox />
      <ActionBar />
    </div>
  );
});
