import { ReactNode, useCallback, useMemo } from "react";
import * as Ant from "antd";
import { GoLocation } from "react-icons/go";
import { GiOpenTreasureChest } from "react-icons/gi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoIosGrid } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import { screens } from "../data";
import { selectors } from "../state";
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
  selectedAction: null | MenuKind;
  onClose(): void;
  onSelectAction(name: MenuKind, content: ReactNode): void;
}

export function ActionBar({ selectedAction, onClose, onSelectAction }: Props) {
  const playerData = selectors.selectPlayerData();
  const closeButton = (
    <Selectable>
      <Ant.Menu.Item
        style={{ marginRight: "1rem" }}
        className="noselect"
        onClick={onClose}
      >
        <AiOutlineClose />
        Close
      </Ant.Menu.Item>
    </Selectable>
  );
  const menuConfig = useMemo(() => {
    return {
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
          selectors.selectScreenName() === "title" ? (
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
          ),
        element: <PlacesMenu onClose={onClose} />,
      },
    } as Record<
      MenuKind,
      {
        name: MenuKind;
        inner: ReactNode;
        element: ReactNode;
      }
    >;
  }, [onClose]);

  return (
    <Ant.Menu
      theme="dark"
      mode="horizontal"
      className="action-menu game-font"
      selectable={false}
    >
      {Object.values(menuConfig).map(({ name, inner, element }) =>
        name === selectedAction ? (
          closeButton
        ) : (
          <Selectable>
            <Ant.Menu.Item
              className="noselect"
              onClick={(event) => {
                event.domEvent.preventDefault();
                onSelectAction(name, element);
              }}
            >
              {inner}
            </Ant.Menu.Item>
          </Selectable>
        )
      )}
    </Ant.Menu>
  );
}
