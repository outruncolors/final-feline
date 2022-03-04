import { useContext } from "react";
import * as Ant from "antd";
import { GoLocation } from "react-icons/go";
import cx from "classnames";
import { GameChangerContext, GameStateContext } from "../../App";
import { Screen, ScreenKind, screens } from "../../data";
import { Selectable } from "../Selectable";
import { ComposableMenu } from "./ComposableMenu";

export function PlacesMenu() {
  const { screenName } = useContext(GameStateContext);
  const { changeScreenName, changeScreenAnimation, changeMenu } = useContext(
    GameChangerContext
  );

  return (
    <ComposableMenu title="Places" Icon={GoLocation}>
      <Ant.PageHeader title="Where to?" />
      <Ant.Menu
        mode="vertical"
        theme="dark"
        selectable={false}
        style={{
          textAlign: "right",
        }}
      >
        {Object.values(screens)
          .filter(
            (screen) =>
              !screen.hasOwnProperty("canVisit") || (screen as Screen).canVisit
          )
          .map((screen) => (
            <Selectable key={screen.name} selected={screen.name === screenName}>
              <Ant.Menu.Item
                key={screen.name}
                onClick={() => {
                  if (screen.name !== screenName) {
                    changeScreenName(screen.name as ScreenKind);
                    changeScreenAnimation(screen.initialAnimation);
                    changeMenu(null);
                  }
                }}
              >
                <Ant.Typography.Title
                  level={4}
                  className={cx("fancy game-font")}
                >
                  {screen.title}
                  <screen.Icon
                    style={{
                      position: "relative",
                      top: 2,
                      marginLeft: "1.33rem",
                    }}
                  />
                </Ant.Typography.Title>
              </Ant.Menu.Item>
            </Selectable>
          ))}
      </Ant.Menu>
    </ComposableMenu>
  );
}
