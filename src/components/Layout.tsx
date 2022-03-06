import * as Ant from "antd";
import { ReactNode } from "react";

interface Props {
  footer: ReactNode;
  children: ReactNode;
}

export function Layout({ footer, children }: Props) {
  return (
    <Ant.Layout>
      <Ant.Layout>
        <Ant.Layout.Header>Final Feline</Ant.Layout.Header>
        <Ant.Layout.Content>{children}</Ant.Layout.Content>
        <Ant.Layout.Footer>{footer}</Ant.Layout.Footer>
      </Ant.Layout>
    </Ant.Layout>
  );
}
