import { ReactNode } from "react";
import * as Ant from "antd";

interface Props {
  title: ReactNode;
  Icon: (props: { color: string; size: number }) => JSX.Element;
  children: ReactNode;
}

export function ComposableMenu({ title, Icon, children }: Props) {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Ant.PageHeader
        title={title}
        backIcon={<Icon color="white" size={24} />}
        onBack={() => {}}
        style={{ margin: 0, marginBottom: "1rem", padding: 0 }}
      />
      {children}
    </div>
  );
}
