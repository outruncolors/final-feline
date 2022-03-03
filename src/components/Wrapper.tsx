import * as Ant from "antd";

import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  GameState,
  state as gameState,
  changers,
  setRerender,
  beginTrackingTicks,
} from "../state";
import { loadAssets } from "../common";
import { MenuKind } from "./menus";
import { ActionBar } from ".";

export function Wrapper() {
  const [, setRenders] = useState(0);
  const rerender = useCallback(() => setRenders((prev) => prev + 1), []);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
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
      });
      beginTrackingTicks();
      changers.changeLog("misc", "Appended game screen.");
      changers.changeScreen("title");
      setShowActionMenu(true);
    });
  }, [rerender]);

  // Handle drawer open/close.
  useEffect(() => {
    if (activeMenu && !showDrawer) {
      setShowDrawer(true);
    } else if (!activeMenu && showDrawer) {
      setShowDrawer(false);
    }
  }, [activeMenu, showDrawer]);

  return (
    <div ref={wrapper} className="wrapper noselect">
      {showActionMenu && (
        <ActionBar
          selectedAction={activeMenu}
          onClose={closeMenu}
          onSelectAction={selectAction}
        />
      )}
      {showDrawer && (
        <Ant.Drawer
          placement="right"
          closable={false}
          getContainer={false}
          className="right-drawer"
          visible={showActionMenu}
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
