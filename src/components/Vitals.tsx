import * as Ant from "antd";
import { ReactNode } from "react";
import { FaRegClock } from "react-icons/fa";
import { GiHearts, GiLightningTrio } from "react-icons/gi";

interface Props {
  name: string;
  title: ReactNode;
  stage: number;
  hp: [number, number];
  mp: [number, number];
  atb: number;
  fin: number;
}

export function Vitals({ name, title, hp, mp, atb, fin }: Props) {
  const [currentHp, maxHp] = hp;
  const hpPercent = Math.floor((currentHp / maxHp) * 100);
  const [currentMp, maxMp] = mp;
  const mpPercent = Math.floor((currentMp / maxMp) * 100);
  const atbPercent = Math.floor((atb / 100) * 100);
  const isReady = atbPercent === 100;
  const finPercent = Math.floor((fin / 100) * 100);

  return (
    <div style={{ display: "block" }}>
      <Ant.Comment
        className="vitals"
        author={
          <Ant.Typography.Title style={{ margin: 0, width: "100%" }} level={5}>
            {name}{" "}
            <span className="fancy" style={{ float: "right", fontSize: 12 }}>
              {title}
            </span>
          </Ant.Typography.Title>
        }
        avatar={
          <VitalTooltip title={`Finale: ${finPercent}%`}>
            <Ant.Progress
              type="dashboard"
              percent={finPercent}
              width={50}
              strokeColor="violet"
              trailColor="#190099"
              format={() => (
                <Ant.Avatar
                  src="https://joeschmoe.io/api/v1/random"
                  alt={name}
                />
              )}
            />
          </VitalTooltip>
        }
        content={
          <div>
            <VitalTooltip title={`ATB: ${atbPercent}%`}>
              <Ant.Progress
                percent={atbPercent}
                steps={10}
                strokeWidth={15}
                strokeColor={isReady ? "#ffffff" : "#FFDB58"}
                trailColor="#997500"
                format={() => <FaRegClock />}
                style={{ float: "right", marginBottom: "0.45rem" }}
                status="active"
              />
            </VitalTooltip>
            <VitalTooltip
              title={`HP: ${currentHp} / ${maxHp}  (${atbPercent}%)`}
            >
              <Ant.Progress
                percent={hpPercent}
                strokeColor="#A71112"
                trailColor="#410000"
                strokeWidth={16}
                strokeLinecap="square"
                format={() => <GiHearts />}
                status="active"
                style={{ marginBottom: "0.33rem" }}
              />
            </VitalTooltip>
            <VitalTooltip
              title={`MP: ${currentMp} / ${maxMp}  (${mpPercent}%)`}
            >
              <Ant.Progress
                percent={mpPercent}
                strokeColor="#00B5C7"
                trailColor="#004F61"
                strokeWidth={16}
                strokeLinecap="square"
                format={() => <GiLightningTrio />}
                status="active"
              />
            </VitalTooltip>
          </div>
        }
      />
    </div>
  );
}

const VitalTooltip = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <Ant.Tooltip
    title={title}
    color="rgba(0, 21, 40, 0.85)"
    overlayInnerStyle={{ border: "2px solid #ffffff" }}
  >
    {children}
  </Ant.Tooltip>
);
