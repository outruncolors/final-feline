import * as Ant from "antd";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  GameState,
  state as gameState,
  changers,
  setRerender,
  beginTrackingTicks,
  selectors,
} from "../state";
import { loadAssets } from "../common";
import { MenuKind } from "./menus";
import { ActionBar } from "./ActionBar";
import { SpeechBox } from "./SpeechBox";

export function Wrapper() {
  const [, setRenders] = useState(0);
  const rerender = useCallback(() => setRenders((prev) => prev + 1), []);
  const [showActionBar, setShowActionBar] = useState(false);
  const [showSpeechBox, setShowSpeechBox] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState<null | MenuKind>(null);
  const [menuContent, setMenuContent] = useState<ReactNode>(null);
  const state = useRef<GameState>(gameState);
  const wrapper = useRef<null | HTMLDivElement>(null);
  const closeMenu = useCallback(() => setActiveMenu(null), []);
  const selectAction = useCallback((name: MenuKind, content: ReactNode) => {
    setActiveMenu(name);
    setMenuContent(content);
  }, []);

  // Effects
  // Bootstrap the app and perform the initial loading process.
  useEffect(() => {
    loadAssets().then(() => {
      const { app } = state.current;
      wrapper.current?.appendChild(app.view);

      setRerender(() => {
        rerender();
        setShowSpeechBox(Boolean(selectors.selectDialogue()));
      });
      beginTrackingTicks();
      setShowActionBar(true);

      changers.changeLog("misc", "Appended game screen.");
      changers.changeScreen("city", "intro");
    });
  }, [rerender]);

  // Handle drawer open/close.
  useEffect(() => {
    if (activeMenu && !showMenu) {
      setShowMenu(true);
    } else if (!activeMenu && showMenu) {
      setShowMenu(false);
    }
  }, [activeMenu, showMenu]);

  return (
    <div ref={wrapper} className="wrapper noselect">
      {showSpeechBox && (
        <Ant.Drawer
          placement="bottom"
          closable={false}
          getContainer={false}
          className="bottom-drawer"
          visible={showSpeechBox}
          maskClosable={false}
          width={500}
        >
          {selectors.selectDialogue() && (
            <SpeechBox dialogue={selectors.selectDialogue()!} />
          )}
        </Ant.Drawer>
      )}
      {showActionBar && (
        <ActionBar
          selectedAction={activeMenu}
          onClose={closeMenu}
          onSelectAction={selectAction}
        />
      )}
      {showMenu && (
        <Ant.Drawer
          placement="right"
          closable={false}
          getContainer={false}
          className="right-drawer"
          visible={showActionBar}
          maskClosable={true}
          onClose={closeMenu}
          width={500}
        >
          {menuContent}
        </Ant.Drawer>
      )}
    </div>
  );
}
