import * as Ant from "antd";
import { GoLocation } from "react-icons/go";
import { useEffect, useRef, useState } from "react";
import { GameState, state as gameState, changers, selectors } from "./state";
import { loadAssets } from "./common";

export function Wrapper() {
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [screenTitle, setScreenTitle] = useState("");
  const state = useRef<GameState>(gameState);
  const wrapper = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    loadAssets().then(() => {
      const { app } = state.current;
      wrapper.current?.appendChild(app.view);
      changers.changeLog("misc", "Appended game screen.");
      changers.changeScreen("shop");

      setShowActionMenu(true);
      setShowDrawer(true);

      setScreenTitle(selectors.selectScreenTitle());
    });
  }, []);

  return (
    <div ref={wrapper} className="wrapper noselect">
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
          <li style={{ position: "absolute", right: 20 }}>
            <GoLocation />
            {screenTitle}
          </li>
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
