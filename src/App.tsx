import { ReactNode, useState, createContext, useMemo, useEffect } from "react";
import "./App.css";
import "antd/dist/antd.css";
import { ActionBar, SpeechBox, Layout, MenuKind } from "./components";
import { noop } from "./common";

function App() {
  const [player, setPlayer] = useState<null | GamePlayer>(null);
  const [notifications, setNotifications] = useState<GameNotification[]>([]);
  const [dialogue, setDialogue] = useState<GameDialogue[]>([]);
  const [menu, setMenu] = useState<null | ReactNode>(null);
  const [actions, setActions] = useState<MenuKind[]>([
    "profile",
    "transaction",
    "party",
    "stuff",
  ]);
  const gameState = useMemo<AppState>(
    () => ({
      player,
      notifications,
      dialogue,
      menu,
      actions,
    }),
    [player, notifications, dialogue, menu, actions]
  );
  const gameChangers = useMemo<AppChangers>(
    () => ({
      changePlayer: setPlayer,
      changeNotifications: setNotifications,
      changeDialogue: setDialogue,
      changeMenu: setMenu,
      changeActions: setActions,
    }),
    []
  );

  useEffect(() => {
    setDialogue([
      {
        name: "Lorem McIpsum",
        avatar: "A",
        text:
          "Lorem McIpsum Lorem McIpsum Lorem McIpsum Lorem McIpsum Lorem McIpsum Lorem McIpsum Lorem McIpsum ",
      },
    ]);
  }, []);

  return (
    <AppStateContext.Provider value={gameState}>
      <AppChangerContext.Provider value={gameChangers}>
        <Layout footer={<ActionBar />}>
          <SpeechBox />
        </Layout>
      </AppChangerContext.Provider>
    </AppStateContext.Provider>
  );
}

export default App;

// #region Context
export interface AppState {
  player: null | GamePlayer;
  notifications: GameNotification[];
  dialogue: GameDialogue[];
  menu: null | ReactNode;
  actions: MenuKind[];
}

export const AppStateContext = createContext<AppState>({
  player: null,
  notifications: [],
  dialogue: [],
  menu: null,
  actions: [],
});

export interface AppChangers {
  changePlayer(player: null | GamePlayer): void;
  changeNotifications(notifications: GameNotification[]): void;
  changeDialogue(dialogue: GameDialogue[]): void;
  changeMenu(menu: null | ReactNode): void;
  changeActions(actions: MenuKind[]): void;
}

export const AppChangerContext = createContext<AppChangers>({
  changePlayer: noop,
  changeNotifications: noop,
  changeDialogue: noop,
  changeMenu: noop,
  changeActions: noop,
});

// #endregion

// #region Types
export interface GamePlayer {
  id: string;
  name: string;
  party: string[];
  stuff: string[];
  felidae: 0;
}

export interface GameDialogue {
  name: string;
  avatar: string;
  text: ReactNode;
  closable?: boolean;
  onOpen?(): void;
  onClose?(): void;
}

export interface GameNotification {
  message: ReactNode;
  duration: number;
}

// #endregion
