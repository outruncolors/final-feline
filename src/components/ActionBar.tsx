import * as Ant from "antd";
import { useCallback, useContext, useEffect, useState } from "react";
import { GoLocation } from "react-icons/go";
import { GiOpenTreasureChest } from "react-icons/gi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoIosGrid } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import { ScreenKind, screens } from "../data";
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
import { GameContext } from "../App";

export function ActionBar() {
  const [activeMenu, setActiveMenu] = useState<null | MenuKind>(null);
  const { screenName, menu, changeMenu, player: playerData } = useContext(
    GameContext
  );
  const closeMenu = useCallback(() => {
    changeMenu(null);
    setActiveMenu(null);
  }, [changeMenu, setActiveMenu]);
  const closeButton = (
    <Selectable key="close">
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
  const menuConfig = {
    profile: {
      name: "profile",
      inner: (
        <>
          <span style={{ position: "relative", top: -3, left: -3 }}>
            <Ant.Avatar
              size="small"
              src="https://joeschmoe.io/api/v1/random"
              alt="Player"
            />
          </span>
          {playerData?.name ?? ""}
        </>
      ),
      element: <ProfileMenu />,
    },
    transaction: {
      name: "transaction",
      inner: (
        <>
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
          }).format(playerData?.felidae ?? 0)}
        </>
      ),
      element: <TransactionMenu />,
    },
    party: {
      name: "party",
      inner: (
        <>
          <HiOutlineUserGroup />
          Party
        </>
      ),
      element: <PartyMenu />,
    },
    roster: {
      name: "roster",
      inner: (
        <>
          <IoIosGrid />
          Roster
        </>
      ),
      element: <RosterMenu />,
    },
    stuff: {
      name: "stuff",
      inner: (
        <>
          <GiOpenTreasureChest />
          Stuff
        </>
      ),
      element: <StuffMenu />,
    },
    places: {
      name: "places",
      inner:
        screenName === "title" ? (
          <>
            <GoLocation />
            Places
          </>
        ) : (
          <>
            {(() => {
              if (screenName) {
                const { Icon, title } = screens[screenName as ScreenKind];

                return (
                  <>
                    <Icon /> {title}
                  </>
                );
              } else {
                return null;
              }
            })()}
          </>
        ),
      element: <PlacesMenu />,
    },
  };

  useEffect(() => {
    closeMenu();
  }, [closeMenu, screenName]);

  return (
    <>
      {menu && (
        <Ant.Drawer
          placement="right"
          closable={false}
          getContainer={false}
          className="right-drawer"
          visible={true}
          maskClosable={true}
          onClose={closeMenu}
          width={500}
        >
          {menu}
        </Ant.Drawer>
      )}

      <Ant.Menu
        theme="dark"
        mode="horizontal"
        className="action-menu game-font"
        selectable={false}
      >
        {Object.values(menuConfig).map(({ name, inner, element }) =>
          name === activeMenu ? (
            closeButton
          ) : (
            <Selectable key={name}>
              <Ant.Menu.Item
                className="noselect"
                onClick={(event) => {
                  event.domEvent.preventDefault();
                  changeMenu(element);
                  setActiveMenu(name as MenuKind);
                }}
              >
                {inner}
              </Ant.Menu.Item>
            </Selectable>
          )
        )}
      </Ant.Menu>
    </>
  );
}
