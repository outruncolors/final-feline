import * as Ant from "antd";
import { AiOutlineClose } from "react-icons/ai";
import { GoLocation } from "react-icons/go";
import { GiOpenTreasureChest, GiRun } from "react-icons/gi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameState, state as gameState, changers, selectors } from "../state";
import { loadAssets } from "../common";
import { PartyMenu, StuffMenu } from "./menus";

type MenuKind = "party" | "stuff";

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
      party: <PartyMenu />,
      stuff: <StuffMenu />,
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
  const openStuffMenu = useCallback(() => setActiveMenu("stuff"), []);

  // Effects
  // Bootstrap the app and perform the initial loading process.
  useEffect(() => {
    loadAssets().then(() => {
      const { app } = state.current;
      wrapper.current?.appendChild(app.view);
      changers.changeLog("misc", "Appended game screen.");
      changers.changeScreen("title");
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
          <Ant.Menu.Item>
            <GiRun /> Leave
          </Ant.Menu.Item>

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

          {activeMenu === "stuff" ? (
            closeButton
          ) : (
            <Ant.Menu.Item
              style={{ marginRight: "1rem" }}
              className="noselect"
              onClick={openStuffMenu}
            >
              <GiOpenTreasureChest />
              Stuff
            </Ant.Menu.Item>
          )}

          <Ant.Menu.Item
            className="noselect"
            style={{ marginRight: "1rem", alignSelf: "flex-end" }}
          >
            <GoLocation />
            {screenTitle}
          </Ant.Menu.Item>
          <Ant.Menu.Item className="noselect">
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
          </Ant.Menu.Item>
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
