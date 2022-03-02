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
        <Ant.Layout.Content
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "2rem 0px",
            borderRadius: 8,
          }}
        >
          <div style={{ padding: "2.5em", background: "#333333" }}>
            {children}
          </div>
        </Ant.Layout.Content>
      </Ant.Layout>
      <Ant.Layout.Sider>Sider</Ant.Layout.Sider>
    </Ant.Layout>
  );
}
