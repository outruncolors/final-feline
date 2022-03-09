import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import PixiPlugin from "gsap/PixiPlugin";
import MotionPathPlugin from "gsap/MotionPathPlugin";
import { chance, colors, keyboard } from "../common";

const makeTarget = (index: number) =>
  new PIXI.Graphics()
    .beginFill([colors.red, 0xffff00, colors.red][index])
    .drawCircle(0, 0, 10)
    .endFill();

export const createSpelkirv = (screen: PIXI.Container, difficulty: number) => {
  gsap.registerPlugin(MotionPathPlugin);
  gsap.registerPlugin(PixiPlugin);
  PixiPlugin.registerPIXI(PIXI);

  const lineContainer = new PIXI.Container();
  lineContainer.pivot.set(0.5);
  screen.addChild(lineContainer);
  const _screen = screen as any;

  const circle = new PIXI.Graphics()
    .beginFill(colors.red, 0.3)
    .drawCircle(_screen._width / 2, _screen._height / 2, 400);
  circle.pivot.set(0.5);
  lineContainer.addChild(circle);

  const makeX = () => chance.integer(0, 400);
  const makeY = () => chance.integer(0, 400);
  const points = [makeX(), makeY(), makeX(), makeY(), makeX(), makeY()];
  const line = new PIXI.Graphics()
    .lineStyle(2, colors.white, 1, 0.5)
    .bezierCurveTo(
      points[0],
      points[1],
      points[2],
      points[3],
      points[4],
      points[5]
    );
  circle.addChild(line);
  line.pivot.set(0.5);
  line.position.set(circle.width / 2, circle.height / 2);

  setTimeout(() => {
    const linePoints = (line as any)._geometry.points as number[];
    const split = linePoints.reduce((prev, next, index, array) => {
      if (index % 2 === 0) {
        const x = next,
          y = array[index + 1];

        return [...prev, { x, y }];
      }

      return prev;
    }, [] as Array<{ x: number; y: number }>);
    const targetCoordinates = chance.pickset(split, difficulty);
    let i = 0;
    const targets = chance.n(() => makeTarget(i++), difficulty);

    targets.forEach((target, index) => {
      const { x, y } = targetCoordinates[index];
      target.position.set(x, y);
    });

    line.addChild(...targets);

    const measure = new PIXI.Graphics()
      .beginFill(colors.yellow, 0.5)
      .drawCircle(0, 0, 10);
    measure.pivot.set(0.5);
    measure.blendMode = PIXI.BLEND_MODES.EXCLUSION;
    line.addChild(measure);

    gsap.to(measure, {
      duration: 2,
      motionPath: {
        start: 0,
        path: split,
        curviness: 0,
      },
      repeat: -1,
    });

    const actionButton = keyboard(" ");
    const swapTint = () =>
      (measure.tint =
        measure.tint === colors.blue ? colors.white : colors.blue);
    const activate = () => {
      swapTint();
      PIXI.Ticker.shared.remove(activate);
    };
    actionButton.press = () => {
      swapTint();
      PIXI.Ticker.shared.add(activate);
    };

    let hits = 0;
    let countdown = 0;
    const handleAttempts = () => {
      if (countdown > 0) {
        countdown--;
      } else {
        if (actionButton.isDown) {
          countdown = 20;

          const nextTarget = targets[hits];
          const { x: missedX, y: missedY } = nextTarget.toLocal(
            {
              x: 0,
              y: 0,
            },
            measure
          );
          const totalMiss = Math.abs(missedX) + Math.abs(missedY);

          let rating = "bad";
          let color = colors.red;
          if (totalMiss < 5) {
            rating = "perfect";
            color = colors.yellow;
          } else if (totalMiss < 10) {
            rating = "great";
            color = colors.green;
          } else if (totalMiss < 15) {
            rating = "okay";
            color = colors.white;
          }

          const text = new PIXI.Text(rating.toUpperCase(), {
            letterSpacing: 3,
            stroke: colors.black,
            strokeThickness: 3,
            fontSize: 36,
            fill: colors.white,
          });
          nextTarget.addChild(text);
          text.pivot.set(0.5);
          text.tint = color;

          let count = 0;
          const raiseText = () => {
            if (count >= 10) {
              PIXI.Ticker.shared.remove(raiseText);
            } else {
              count += 0.3;
              text.alpha -= 0.033;
              text.position.y -= 10;
            }
          };

          PIXI.Ticker.shared.add(raiseText);

          // nextTarget.visible = false;

          hits++;

          if (hits === difficulty) {
            PIXI.Ticker.shared.remove(handleAttempts);
          }
        }
      }
    };
    PIXI.Ticker.shared.add(handleAttempts);
  });
};
