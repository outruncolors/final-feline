import * as Ant from "antd";
import { observer } from "mobx-react";
import { GoLocation } from "react-icons/go";
import cx from "classnames";
import { ComposableMenu } from "./ComposableMenu";
import { Screen, ScreenKind, screens } from "../../data";
import { Selectable } from "../Selectable";

export function PlacesMenu() {
  return <div>{null}</div>;
}

// export const PlacesMenu = observer(() => {
// const screenName = selectors.selectScreenName(state) as ScreenKind;

// return (
//   <ComposableMenu title="Places" Icon={GoLocation}>
//     <Ant.PageHeader title="Where to?" />
//     <Ant.Menu
//       mode="vertical"
//       theme="dark"
//       selectable={false}
//       style={{
//         textAlign: "right",
//       }}
//     >
//       {Object.values(screens)
//         .filter(
//           (screen) =>
//             !screen.hasOwnProperty("canVisit") || (screen as Screen).canVisit
//         )
//         .map((screen) => (
//           <Selectable key={screen.name} selected={screen.name === screenName}>
//             <Ant.Menu.Item
//               key={screen.name}
//               onClick={() => {
//                 if (screen.name !== screenName) {
//                   changers.changeScreen(state, screen.name as ScreenKind);
//                   changers.changeMenu(state, null);
//                 }
//               }}
//             >
//               <Ant.Typography.Title
//                 level={4}
//                 className={cx("fancy game-font")}
//               >
//                 {screen.title}
//                 <screen.Icon
//                   style={{
//                     position: "relative",
//                     top: 2,
//                     marginLeft: "1.33rem",
//                   }}
//                 />
//               </Ant.Typography.Title>
//             </Ant.Menu.Item>
//           </Selectable>
//         ))}
//     </Ant.Menu>
//   </ComposableMenu>
// );
// });
