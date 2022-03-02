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
          <Ant.Menu.Item className="action-menu-action">Leave</Ant.Menu.Item>

          <li style={{ position: "absolute", right: 20 }}>
            <Ant.Menu theme="dark" mode="horizontal">
              <li style={{ marginRight: "1rem" }}>
                <GoLocation />
                {screenTitle}
              </li>

              <li>
                <img
                  alt="Felidae"
                  src="/assets/forte.svg"
                  width={20}
                  height={20}
                  style={{
                    position: "relative",
                    top: -2,
                    right: -2,
                  }}
                />
                200.00
              </li>
            </Ant.Menu>
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
