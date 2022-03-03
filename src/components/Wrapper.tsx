import * as Ant from "antd";
import { AiOutlineClose } from "react-icons/ai";
import { GoLocation } from "react-icons/go";
import { GiOpenTreasureChest } from "react-icons/gi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoIosGrid } from "react-icons/io";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GameState,
  state as gameState,
  changers,
  selectors,
  setRerender,
  beginTrackingTicks,
} from "../state";
import { loadAssets } from "../common";
import { screens } from "../data";
import {
  MenuKind,
  PartyMenu,
  PlacesMenu,
  ProfileMenu,
  RosterMenu,
  StuffMenu,
  TransactionMenu,
} from "./menus";
import { Selectable } from "./Selectable";

export function Wrapper() {
  const [, setRenders] = useState(0);
  const rerender = useCallback(() => setRenders((prev) => prev + 1), []);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [activeMenu, setActiveMenu] = useState<null | MenuKind>(null);
  const state = useRef<GameState>(gameState);
  const wrapper = useRef<null | HTMLDivElement>(null);
  const playerData = selectors.selectPlayerData();

  //
  const closeMenu = useCallback(() => setActiveMenu(null), []);
  const closeButton = (
    <Selectable>
      <Ant.Menu.Item
        style={{ marginRight: "1rem" }}
        className="noselect"
        onClick={closeMenu}
      >
        <AiOutlineClose />
        Close
      </Ant.Menu.Item>
    </Selectable>
  );

  // Memo
  const menuLookup: Record<MenuKind, JSX.Element> = useMemo(
    () => ({
      profile: <ProfileMenu />,
      transaction: <TransactionMenu />,
      party: <PartyMenu />,
      roster: <RosterMenu />,
      stuff: <StuffMenu />,
      places: <PlacesMenu onClose={closeMenu} />,
    }),
    [closeMenu]
  );
  const drawerContent = useMemo(
    () => (activeMenu ? menuLookup[activeMenu] : null),
    [menuLookup, activeMenu]
  );

  const openProfileMenu = useCallback(() => setActiveMenu("profile"), []);
  const openTransactionMenu = useCallback(
    () => setActiveMenu("transaction"),
    []
  );
  const openPartyMenu = useCallback(() => setActiveMenu("party"), []);
  const openRosterMenu = useCallback(() => setActiveMenu("roster"), []);
  const openStuffMenu = useCallback(() => setActiveMenu("stuff"), []);
  const openPlacesMenu = useCallback(() => setActiveMenu("places"), []);

  const closeMenuOnDocumentClick = useCallback(
    (event: MouseEvent) => {
      if (activeMenu && event.target) {
        let parent = event.target;

        while ((parent as any).parent) {
          parent = (parent as any).parent;

          if ((parent as Element).classList.contains("television")) {
            return;
          }
        }

        closeMenu();
      }
    },
    [activeMenu]
  );

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

  // Close the menu whenever document is clicked.
  useEffect(() => {
    document.body.addEventListener("click", closeMenuOnDocumentClick);

    return () => {
      document.body.removeEventListener("click", closeMenuOnDocumentClick);
    };
  }, [closeMenuOnDocumentClick]);

  return (
    <div ref={wrapper} className="wrapper noselect">
      {showActionMenu && (
        <Ant.Menu
          theme="dark"
          mode="horizontal"
          className="action-menu game-font"
          selectable={false}
        >
          <Selectable>
            <Ant.Menu.Item className="noselect" onClick={openProfileMenu}>
              <span style={{ position: "relative", top: -3, left: -3 }}>
                <Ant.Avatar
                  size="small"
                  src="https://joeschmoe.io/api/v1/random"
                  alt="Player"
                />
              </span>
              {playerData.name}
            </Ant.Menu.Item>
          </Selectable>

          <Selectable>
            <Ant.Menu.Item className="noselect" onClick={openTransactionMenu}>
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
              {new Intl.NumberFormat("en-us", {
                style: "decimal",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(playerData.felidae)}
            </Ant.Menu.Item>
          </Selectable>

          {activeMenu === "party" ? (
            closeButton
          ) : (
            <Selectable>
              <Ant.Menu.Item className="noselect" onClick={openPartyMenu}>
                <HiOutlineUserGroup />
                Party
              </Ant.Menu.Item>
            </Selectable>
          )}

          {activeMenu === "roster" ? (
            closeButton
          ) : (
            <Selectable>
              <Ant.Menu.Item className="noselect" onClick={openRosterMenu}>
                <IoIosGrid />
                Roster
              </Ant.Menu.Item>
            </Selectable>
          )}

          {activeMenu === "stuff" ? (
            closeButton
          ) : (
            <Selectable>
              <Ant.Menu.Item className="noselect" onClick={openStuffMenu}>
                <GiOpenTreasureChest />
                Stuff
              </Ant.Menu.Item>
            </Selectable>
          )}

          <Selectable>
            <Ant.Menu.Item className="noselect" onClick={openPlacesMenu}>
              {selectors.selectScreenName() === "title" ? (
                <>
                  <GoLocation />
                  Places
                </>
              ) : (
                <>
                  {(() => {
                    const which = selectors.selectScreenName();

                    if (which) {
                      const { Icon } = screens[which];

                      return <Icon />;
                    } else {
                      return null;
                    }
                  })()}
                  {selectors.selectScreenTitle()}
                </>
              )}
            </Ant.Menu.Item>
          </Selectable>
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
