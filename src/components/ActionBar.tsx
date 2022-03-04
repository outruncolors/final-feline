import * as Ant from "antd";
import { ReactNode, useState } from "react";
import { GoLocation } from "react-icons/go";
import { GiOpenTreasureChest } from "react-icons/gi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoIosGrid } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import { screens } from "../data";
import { GameState, changers, selectors } from "../state";
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

interface Props {
  state: GameState;
}

export function ActionBar({ state }: Props) {
  const [menuContent, setMenuContent] = useState<ReactNode>(null);
  const playerData = selectors.selectPlayerData(state);
  const screenName = selectors.selectScreenName(state);
  const screenTitle = selectors.selectScreenTitle(state);
  const menu = selectors.selectActiveMenu(state);
  const closeMenu = () => {
    changers.changeMenu(null);
    setMenuContent(null);
  };
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
          {playerData.name}
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
          }).format(playerData.felidae)}
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
                const { Icon } = screens[screenName];

                return <Icon />;
              } else {
                return null;
              }
            })()}
            {screenTitle}
          </>
        ),
      element: <PlacesMenu state={state} />,
    },
  };

  return (
    <>
      {menuContent && (
        <Ant.Drawer
          placement="right"
          closable={false}
          getContainer={false}
          className="right-drawer"
          visible={Boolean(menuContent)}
          maskClosable={true}
          onClose={closeMenu}
          width={500}
        >
          {menuContent}
        </Ant.Drawer>
      )}

      <Ant.Menu
        theme="dark"
        mode="horizontal"
        className="action-menu game-font"
        selectable={false}
      >
        {Object.values(menuConfig).map(({ name, inner, element }) =>
          name === menu ? (
            closeButton
          ) : (
            <Selectable>
              <Ant.Menu.Item
                className="noselect"
                onClick={(event) => {
                  event.domEvent.preventDefault();
                  changers.changeMenu(name as MenuKind);
                  setMenuContent(element);
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
