import * as Ant from "antd";
import { ReactNode } from "react";
import { Vitals } from "./Vitals";

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
          <div className="television">
            {children}

            <Vitals
              name="Foo Bar"
              job="copamancer"
              stage={3}
              hp={[90, 100]}
              mp={[80, 100]}
              atb={100}
              fin={20}
            />
          </div>
        </Ant.Layout.Content>
      </Ant.Layout>
      <Ant.Layout.Sider></Ant.Layout.Sider>
    </Ant.Layout>
  );
}
