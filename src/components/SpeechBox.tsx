import * as Ant from "antd";
import { Dialogue, changers, selectors } from "../state";

interface Props {
  dialogue: Dialogue;
}

export function SpeechBox({ dialogue }: Props) {
  const { name, avatar, text } = dialogue;
  const actions = [
    <Ant.Button
      key="done"
      type="ghost"
      onClick={() => changers.finishDialogue()}
    >
      Done
    </Ant.Button>,
  ];

  const hasNextOne = selectors.selectDialogueCount() > 1;
  if (hasNextOne) {
    actions.unshift(
      <Ant.Button
        key="next"
        type="ghost"
        onClick={() => changers.nextDialogue()}
        style={{ marginRight: "1rem" }}
      >
        Next
      </Ant.Button>
    );
  }

  actions.reverse();

  return (
    <Ant.Comment
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
}
