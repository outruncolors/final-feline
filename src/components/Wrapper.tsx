import * as Ant from "antd";
import { observer } from "mobx-react";
import { useEffect, useRef } from "react";
import { GameState, changers, beginTrackingTicks, selectors } from "../state";
import { loadAssets } from "../common";
import { ActionBar } from "./ActionBar";
import { SpeechBox } from "./SpeechBox";

export const Wrapper = observer(FinalFeline);

interface Props {
  state: GameState;
}

function FinalFeline({ state }: Props) {
  const wrapper = useRef<null | HTMLDivElement>(null);
  const dialogue = selectors.selectDialogue(state);

  // Effects
  // Bootstrap the app and perform the initial loading process.
  const hasBootstrapped = useRef(false);
  useEffect(() => {
    if (!hasBootstrapped.current) {
      hasBootstrapped.current = true;

      loadAssets().then(() => {
        const { app } = state;
        wrapper.current?.appendChild(app.view);
        beginTrackingTicks();
        changers.changeScreen("title");
      });
    }
  }, [state]);

  return (
    <div ref={wrapper} className="wrapper noselect">
      {dialogue && (
        <Ant.Drawer
          placement="bottom"
          closable={false}
          getContainer={false}
          className="bottom-drawer"
          visible={true}
          maskClosable={false}
          width={500}
        >
          <SpeechBox state={state} dialogue={dialogue} />
        </Ant.Drawer>
      )}

      <ActionBar state={state} />
    </div>
  );
}
