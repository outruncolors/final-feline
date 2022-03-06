import * as Ant from "antd";
import { useCallback, useContext } from "react";
import { GiOpenTreasureChest, GiWrench } from "react-icons/gi";
import { HiOutlineUserGroup } from "react-icons/hi";
import {
  MenuKind,
  DebugMenu,
  EntityMenu,
  PartyMenu,
  ProfileMenu,
  StuffMenu,
  TransactionMenu,
} from "./menus";
import { Selectable } from "./Selectable";
import { AppStateContext, AppChangerContext } from "../App";

export function ActionBar() {
  const { menu, player: playerData, actions } = useContext(AppStateContext);
  const { changeMenu } = useContext(AppChangerContext);
  const closeMenu = useCallback(() => changeMenu(null), [changeMenu]);
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
    debug: {
      name: "Debug",
      inner: (
        <>
          <GiWrench />
          Debug
        </>
      ),
      element: <DebugMenu />,
    },
    entity: {
      name: "entity",
      inner: "(entity)",
      element: <EntityMenu />,
    },
  };

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
        {Object.values(menuConfig)
          .filter((each) => actions.includes(each.name as MenuKind))
          .map(({ name, inner, element }) => (
            <>
              <Selectable key={name}>
                <Ant.Menu.Item
                  className="noselect"
                  disabled={inner === null}
                  onClick={(event) => {
                    event.domEvent.preventDefault();
                    changeMenu(element);
                  }}
                >
                  {inner}
                </Ant.Menu.Item>
              </Selectable>
            </>
          ))}
      </Ant.Menu>
    </>
  );
}
