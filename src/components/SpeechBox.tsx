import { useContext } from "react";
import * as Ant from "antd";
import { AppStateContext, AppChangerContext } from "../App";

export function SpeechBox() {
  const { dialogue } = useContext(AppStateContext);
  const { changeDialogue } = useContext(AppChangerContext);

  const activeDialogue = dialogue[0];

  if (activeDialogue) {
    const restOfDialogue = dialogue.slice(1);
    const noop = () => {};
    const {
      name,
      avatar,
      text,
      closable = true,
      onClose = noop,
      onOpen = noop,
    } = activeDialogue;

    let actions = [] as JSX.Element[];
    if (closable) {
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

      actions = [
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
    }

    return (
      <Ant.Comment
        className="speech-box"
        author={<Ant.Typography.Title level={3}>{name}</Ant.Typography.Title>}
        avatar={
          <Ant.Avatar
            size="large"
            src="https://joeschmoe.io/api/v1/random"
            alt={avatar}
          />
        }
        content={
          <Ant.Typography.Text style={{ fontSize: "1.2rem" }}>
            {text}
          </Ant.Typography.Text>
        }
        actions={actions}
      />
    );
  } else {
    return null;
  }
}
