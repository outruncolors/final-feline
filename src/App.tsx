import {
  ReactNode,
  useEffect,
  useRef,
  useState,
  createContext,
  useMemo,
} from "react";
import * as PIXI from "pixi.js";
import "./App.css";
import "antd/dist/antd.css";
import { loadAssets, loadScreenAnimations } from "./common";
import { Layout, Wrapper } from "./components";
import {
  AfflictionKind,
  FoeKind,
  ItemKind,
  JobKind,
  ScreenKind,
  screens,
  SkillKind,
} from "./data";

const noop = () => {};
export const GameContext = createContext<Record<string, any>>({
  screenName: null,
  screenAnimation: null,
  player: null,
  notifications: [],
  dialogue: [],
  menu: null,
  changeScreenAnimation: noop,
  changePlayer: noop,
  changeNotifications: noop,
  changeDialogue: noop,
  changeMenu: noop,
});

function App() {
  const app = useRef<null | PIXI.Application>(null);
  const screen = useRef<null | PIXI.Container>(null);
  const [screenName, setScreenName] = useState<null | ScreenKind>(null);
  const [screenAnimation, setScreenAnimation] = useState<null | string>(null);
  const [player, setPlayer] = useState<null | GamePlayer>(null);
  const [fuzzing, setFuzzing] = useState(false);
  const [notifications, setNotifications] = useState<GameNotification[]>([]);
  const [dialogue, setDialogue] = useState<GameDialogue[]>([]);
  const [menu, setMenu] = useState<null | ReactNode>(null);
  const gameChangers = useMemo(
    () => ({
      screenName,
      screenAnimation,
      player,
      notifications,
      dialogue,
      menu,
      changeScreenName: setScreenName,
      changeScreenAnimation: setScreenAnimation,
      changePlayer: setPlayer,
      changeNotifications: setNotifications,
      changeDialogue: setDialogue,
      changeMenu: setMenu,
    }),
    [screenName, screenAnimation, player, notifications, dialogue, menu]
  );

  useEffect(() => {}, [fuzzing]);

  useEffect(() => {
    if (screenName) {
      const animations = loadScreenAnimations(screenName);
      const [defaultAnimation] = Object.values(animations);
      const animationToUse = screenAnimation
        ? animations[screenAnimation]
        : defaultAnimation;

      if (animationToUse) {
        screen.current?.addChild(animationToUse);

        return () => {
          screen.current?.removeChild(animationToUse);
        };
      }
    }
  }, [screenName, screenAnimation]);

  useEffect(() => {
    loadAssets().then(() => {
      screen.current = new PIXI.Container();
      app.current = new PIXI.Application({ width: 1920 / 2, height: 1080 / 2 });
      app.current.stage.addChild(screen.current);
      app.current.renderer.render(app.current.stage);

      setScreenName("housing");
      setScreenAnimation("right-talk");
    });
  }, []);

  return (
    <GameContext.Provider value={gameChangers}>
      <Layout>{app.current && <Wrapper app={app.current} />}</Layout>
    </GameContext.Provider>
  );
}

export default App;

export interface GamePlayer {
  id: string;
  name: string;
  stuff: ItemAndQuantity[];
  party: TeamMember[];
  roster: TeamMember[];
  felidae: number;
  transactions: string[];
}

export interface GameEntity {
  name: string;
  stage: number;
  hp: [number, number];
  mp: [number, number];
  atb: number;
  fin: number;
  affliction: AfflictionKind;
  skills: SkillKind[];
}

export interface TeamMember extends GameEntity {
  job: JobKind;
}

export interface Foe extends GameEntity {
  foe: FoeKind;
}

export type ItemAndQuantity = [ItemKind, number];

export interface GameDialogue {
  name: string;
  avatar: string;
  text: string;
}

export interface GameLog {
  kind: string;
  message: string;
}

export interface GameNotification {
  message: ReactNode;
  duration: number;
}
