import * as Ant from "antd";
import { observer } from "mobx-react";
import { changers, selectors, state } from "../state";

export const SpeechBox = observer(() => {
  const activeDialogue = state.dialogue[0];

  if (activeDialogue) {
    const { name, avatar, text } = activeDialogue;

    const actions = [
      <Ant.Button
        key="done"
        type="ghost"
        onClick={() => changers.finishDialogue(state)}
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
          onClick={() => changers.nextDialogue(state)}
          style={{ marginRight: "1rem" }}
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
});
