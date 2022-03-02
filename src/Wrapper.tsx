import * as Ant from "antd";
import { useEffect, useRef, useState } from "react";
import { GameState, state as gameState, getChangers } from "./state";
import { loadAssets } from "./common";

export function Wrapper() {
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const state = useRef<GameState>(gameState);
  const wrapper = useRef<null | HTMLDivElement>(null);
  const changers = useRef(getChangers());

  useEffect(() => {
    loadAssets().then(() => {
      const { app } = state.current;
      wrapper.current?.appendChild(app.view);
      changers.current.changeLog("misc", "Appended game screen.");
      changers.current.changeScreen("shop");
      changers.current.changeNotifications("Foo");
      setShowActionMenu(true);
      setShowDrawer(true);
    });
  }, []);

  return (
    <div ref={wrapper} className="wrapper">
      {showActionMenu && (
        <Ant.Menu
          theme="dark"
          mode="horizontal"
          className="action-menu"
          selectable={false}
        >
          <Ant.Menu.Item>Action A</Ant.Menu.Item>
          <Ant.Menu.Item onClick={() => setShowDrawer((prev) => !prev)}>
            Action B
          </Ant.Menu.Item>
          <Ant.Menu.Item>Action C</Ant.Menu.Item>
        </Ant.Menu>
      )}
      {showDrawer && (
        <Ant.Drawer
          placement="right"
          closable={false}
          getContainer={false}
          className="right-drawer"
          visible={showActionMenu}
          mask={false}
          width={300}
        ></Ant.Drawer>
      )}
    </div>
  );
}
