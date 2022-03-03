import * as Ant from "antd";
import { GoLocation } from "react-icons/go";
import { ComposableMenu } from "./ComposableMenu";
import { Screen, ScreenKind, screens } from "../../data";
import { changers, selectors } from "../../state";

interface Props {
  onClose(): void;
}

export const PlacesMenu = ({ onClose }: Props) => {
  const title = selectors.selectScreenTitle();

  return (
    <ComposableMenu title="Places" Icon={GoLocation}>
      <Ant.Menu mode="inline" theme="dark" selectedKeys={[title]}>
        {Object.values(screens)
          .filter(
            (screen) =>
              !screen.hasOwnProperty("canVisit") || (screen as Screen).canVisit
          )
          .map((screen) => (
            <Ant.Menu.Item
              key={screen.name}
              onClick={() => {
                changers.changeScreen(screen.name as ScreenKind);
                onClose();
              }}
            >
              {screen.title}
            </Ant.Menu.Item>
          ))}
      </Ant.Menu>
    </ComposableMenu>
  );
};
