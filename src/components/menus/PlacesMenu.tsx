import * as Ant from "antd";
import { GoLocation } from "react-icons/go";
import cx from "classnames";
import { ComposableMenu } from "./ComposableMenu";
import { Screen, ScreenKind, screens } from "../../data";
import { changers, selectors } from "../../state";
import { Selectable } from "../Selectable";

interface Props {
  onClose(): void;
}

export const PlacesMenu = ({ onClose }: Props) => {
  const which = selectors.selectScreenName() as ScreenKind;

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
            <Selectable key={screen.name} selected={screen.name === which}>
              <Ant.Menu.Item
                key={screen.name}
                onClick={() => {
                  if (screen.name !== which) {
                    changers.changeScreen(screen.name as ScreenKind);
                    onClose();
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
};
