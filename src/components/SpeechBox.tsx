import * as Ant from "antd";
import { GameDialogue, changers, selectors, GameState } from "../state";

interface Props {
  state: GameState;
  dialogue: GameDialogue;
}

export function SpeechBox({ dialogue, state }: Props) {
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

  const hasNextOne = selectors.selectDialogueCount(state) > 1;
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
