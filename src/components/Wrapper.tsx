import * as Ant from "antd";
import { AiOutlineClose } from "react-icons/ai";
import { GoLocation } from "react-icons/go";
import { HiOutlineUserGroup } from "react-icons/hi";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameState, state as gameState, changers, selectors } from "../state";
import { loadAssets } from "../common";
import { Vitals } from "./Vitals";

type MenuKind = "party";

export function Wrapper() {
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [activeMenu, setActiveMenu] = useState<null | MenuKind>(null);
  const [screenTitle, setScreenTitle] = useState("");
  const state = useRef<GameState>(gameState);
  const wrapper = useRef<null | HTMLDivElement>(null);

  // Memo
  const menuLookup: Record<MenuKind, JSX.Element> = useMemo(
    () => ({
      party: (
        <>
          <Ant.PageHeader
            title="Party"
            backIcon={<HiOutlineUserGroup color="white" size={24} />}
            onBack={() => {}}
            style={{ margin: 0, marginBottom: "1rem", padding: 0 }}
          />
          <Vitals
            name="Foo Bar"
            job="copamancer"
            stage={3}
            hp={[90, 100]}
            mp={[80, 100]}
            atb={100}
            fin={20}
          />
        </>
      ),
    }),
    []
  );
  const drawerContent = useMemo(
    () => (activeMenu ? menuLookup[activeMenu] : null),
    [menuLookup, activeMenu]
  );

  const closeMenu = useCallback(() => setActiveMenu(null), []);
  const closeButton = (
    <Ant.Menu.Item
      style={{ marginRight: "1rem" }}
      className="noselect"
      onClick={closeMenu}
    >
      <AiOutlineClose />
      Close
    </Ant.Menu.Item>
  );
  const openPartyMenu = useCallback(() => setActiveMenu("party"), []);

  // Effects
  // Bootstrap the app and perform the initial loading process.
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
        <Ant.Menu
          theme="dark"
          mode="horizontal"
          className="action-menu"
          selectable={false}
        >
          <Ant.Menu.Item className="action-menu-action">Leave</Ant.Menu.Item>

          <li style={{ position: "absolute", right: 20 }}>
            <Ant.Menu theme="dark" mode="horizontal" selectable={false}>
              {activeMenu === "party" ? (
                closeButton
              ) : (
                <Ant.Menu.Item
                  style={{ marginRight: "1rem" }}
                  className="noselect"
                  onClick={openPartyMenu}
                >
                  <HiOutlineUserGroup />
                  Party
                </Ant.Menu.Item>
              )}
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
          maskClosable={true}
          onClose={closeMenu}
          width={500}
        >
          {drawerContent}
        </Ant.Drawer>
      )}
    </div>
  );
}
