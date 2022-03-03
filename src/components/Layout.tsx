import * as Ant from "antd";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function Layout({ children }: Props) {
  return (
    <Ant.Layout>
      <Ant.Layout>
        <Ant.Layout.Header
          style={{
            color: "#EFFEEF",
            fontSize: "2rem",
          }}
        >
          Final Feline
        </Ant.Layout.Header>
        <Ant.Layout.Content>
          <div className="television">{children}</div>
        </Ant.Layout.Content>
      </Ant.Layout>
    </Ant.Layout>
  );
}
