import Chance from "chance";
import {
  ReactNode,
  useEffect,
  useRef,
  useState,
  createContext,
  useMemo,
  useCallback,
} from "react";
import * as PIXI from "pixi.js";
import "./App.css";
import "antd/dist/antd.css";
import { colors, loadAssets, loadScreenAnimations } from "./common";
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
const CHANCE = new Chance();

export const GameStateContext = createContext<GameState>({
  getScreen: () => null,
  screenName: null,
  screenAnimation: null,
  player: null,
  notifications: [],
  dialogue: [],
  menu: null,
});
export const GameChangerContext = createContext<GameChangers>({
  changeScreenName: noop,
  changeScreenAnimation: noop,
  changePlayer: noop,
  changeNotifications: noop,
  changeDialogue: noop,
  changeMenu: noop,
  randomizeScreenAnimation: noop,
});

function App() {
  const app = useRef<null | PIXI.Application>(null);
  const screen = useRef<null | PIXI.Container>(null);
  const [screenName, setScreenName] = useState<null | ScreenKind>(null);
  const [screenAnimation, setScreenAnimation] = useState<null | string>(null);
  const [player, setPlayer] = useState<null | GamePlayer>(null);
  const [notifications, setNotifications] = useState<GameNotification[]>([]);
  const [dialogue, setDialogue] = useState<GameDialogue[]>([]);
  const [menu, setMenu] = useState<null | ReactNode>(null);
  const gameState = useMemo<GameState>(
    () => ({
      getScreen: () => screen.current,
      screenName,
      screenAnimation,
      player,
      notifications,
      dialogue,
      menu,
    }),
    [screenName, screenAnimation, player, notifications, dialogue, menu]
  );
  const randomizingScreenAnimation = useRef<NodeJS.Timeout>();
  const randomizeScreenAnimation = useCallback(
    (frequencyInMs: number) => {
      const chooseRandomAnimation = () => {
        const willChange = CHANCE.bool({ likelihood: 20 });

        if (willChange && screenName) {
          setScreenAnimation(CHANCE.pickone(screens[screenName].animations));
        }

        setTimeout(chooseRandomAnimation, frequencyInMs);
      };

      randomizingScreenAnimation.current = setTimeout(
        chooseRandomAnimation,
        frequencyInMs
      );
    },
    [screenName]
  );
  const gameChangers = useMemo<GameChangers>(
    () => ({
      changeScreenName: setScreenName,
      changeScreenAnimation: setScreenAnimation,
      changePlayer: setPlayer,
      changeNotifications: setNotifications,
      changeDialogue: setDialogue,
      changeMenu: setMenu,
      randomizeScreenAnimation: randomizeScreenAnimation,
    }),
    [randomizeScreenAnimation]
  );
  const sinceLastFuzzChange = useRef(0);
  const handleGameTick = useCallback(() => {
    const _screen = screen.current;

    if (_screen) {
      const fuzzer = _screen.getChildByName("fuzzer");

      if (fuzzer) {
        if (sinceLastFuzzChange.current === 20) {
          const value = Math.random();
          (fuzzer.filters![0] as any).seed = value;
          sinceLastFuzzChange.current = 0;
        } else {
          sinceLastFuzzChange.current++;
        }
      } else {
        sinceLastFuzzChange.current = 0;
      }
    }
  }, []);

  // Bootstrapping
  const hasBootstrapped = useRef(false);
  useEffect(() => {
    if (!hasBootstrapped.current) {
      hasBootstrapped.current = true;

      loadAssets().then(() => {
        PIXI.Ticker.shared.add(handleGameTick);

        screen.current = new PIXI.Container();
        screen.current.name = "screen";
        app.current = new PIXI.Application({
          width: 1920 / 2,
          height: 1080 / 2,
        });
        app.current.stage.addChild(screen.current);
        app.current.renderer.render(app.current.stage);

        setScreenName("title");
        setTimeout(() => screens.title.script(gameState, gameChangers));
      });
    }
  });

  // Changing screen or animation.
  useEffect(() => {
    const _screen = screen.current;

    if (_screen && screenName) {
      const animations = loadScreenAnimations(screenName);
      const animationToUse = screenAnimation
        ? animations[screenAnimation]
        : animations[screens[screenName].initialAnimation];

      if (animationToUse) {
        _screen.addChild(animationToUse);

        return () => {
          _screen.removeChild(animationToUse);
        };
      }
    }
  }, [screenName, screenAnimation]);

  // Fuzzing
  const lastScreenLoaded = useRef("title");
  useEffect(() => {
    const _screen = screen.current;
    const _lastScreen = lastScreenLoaded.current;

    if (_screen && screenName && screenName !== _lastScreen) {
      if (randomizingScreenAnimation.current) {
        clearTimeout(randomizingScreenAnimation.current);
      }

      lastScreenLoaded.current = screenName;

      for (const child of _screen.children) {
        if (child.name === "TEMP") {
          child.parent.removeChild(child);
          child.interactive = false;
          child.visible = false;
        }
      }

      const fuzzer = new PIXI.Sprite(PIXI.Texture.WHITE);
      fuzzer.name = "fuzzer";
      fuzzer.width = _screen.width;
      fuzzer.height = _screen.height;
      const noise = new PIXI.filters.NoiseFilter();
      fuzzer.filters = [noise];
      fuzzer.tint = colors.black;
      _screen.addChild(fuzzer);

      fuzzer.on("destroyed", () => {
        const screenNow = screens[lastScreenLoaded.current as ScreenKind];
        screenNow?.script(gameState, gameChangers);
      });

      setTimeout(() => {
        _screen.removeChild(fuzzer);
        fuzzer.destroy();
      }, 1200);
    }
  }, [screenName, gameState, gameChangers]);

  return (
    <GameStateContext.Provider value={gameState}>
      <GameChangerContext.Provider value={gameChangers}>
        <Layout>{app.current && <Wrapper app={app.current} />}</Layout>
      </GameChangerContext.Provider>
    </GameStateContext.Provider>
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
  onOpen?(): void;
  onClose?(): void;
}

export interface GameLog {
  kind: string;
  message: string;
}

export interface GameNotification {
  message: ReactNode;
  duration: number;
}

export interface GameState {
  getScreen(): null | PIXI.Container;
  screenName: null | ScreenKind;
  screenAnimation: null | string;
  player: null | GamePlayer;
  notifications: GameNotification[];
  dialogue: GameDialogue[];
  menu: null | ReactNode;
}

export interface GameChangers {
  changeScreenName(screen: null | ScreenKind): void;
  changeScreenAnimation(animation: null | string): void;
  changePlayer(player: null | GamePlayer): void;
  changeNotifications(notifications: GameNotification[]): void;
  changeDialogue(dialogue: GameDialogue[]): void;
  changeMenu(menu: null | ReactNode): void;
  randomizeScreenAnimation(frequency: number): void;
}
