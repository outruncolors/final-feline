import { useContext } from "react";
import * as Ant from "antd";
import { GameContext } from "../App";

export function SpeechBox() {
  const { dialogue, changeDialogue } = useContext(GameContext);

  const activeDialogue = dialogue[0];

  if (activeDialogue) {
    const { name, avatar, text } = activeDialogue;

    const actions = [
      <Ant.Button key="done" type="ghost" onClick={() => changeDialogue([])}>
        Done
      </Ant.Button>,
    ];

    const hasNextOne = false;
    if (hasNextOne) {
      actions.unshift(
        <Ant.Button
          key="next"
          type="ghost"
          style={{ marginRight: "1rem" }}
          onClick={() => changeDialogue(dialogue.slice(1))}
        >
          Next
        </Ant.Button>
      );
    }

    actions.reverse();

    return (
      <Ant.Comment
        className="speech-box"
        author={name}
        avatar={
          <Ant.Avatar
            size="large"
            src="https://joeschmoe.io/api/v1/random"
            alt={avatar}
          />
        }
        content={text}
        actions={actions}
      />
    );
  } else {
    return null;
  }
}
