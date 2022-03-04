import { useContext } from "react";
import * as Ant from "antd";
import { GameStateContext, GameChangerContext } from "../App";

export function SpeechBox() {
  const { dialogue } = useContext(GameStateContext);
  const { changeDialogue } = useContext(GameChangerContext);

  const activeDialogue = dialogue[0];

  if (activeDialogue) {
    const restOfDialogue = dialogue.slice(1);
    const noop = () => {};
    const {
      name,
      avatar,
      text,
      onClose = noop,
      onOpen = noop,
    } = activeDialogue;
    const closeDialogue = () => {
      onClose();

      changeDialogue([]);

      // Handle the rest of the unseen messages.
      for (const each of restOfDialogue) {
        each.onOpen?.();
        each.onClose?.();
      }
    };
    const nextDialog = () => {
      onClose();
      changeDialogue(restOfDialogue);
      onOpen();
    };

    const actions = [
      <Ant.Button key="done" type="ghost" onClick={closeDialogue}>
        Done
      </Ant.Button>,
    ];

    const hasNextOne = dialogue.length > 1;
    if (hasNextOne) {
      actions.unshift(
        <Ant.Button
          key="next"
          type="ghost"
          style={{ marginRight: "1rem" }}
          onClick={nextDialog}
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
