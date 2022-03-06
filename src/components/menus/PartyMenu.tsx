import { HiOutlineUserGroup } from "react-icons/hi";
import { Vitals } from "../Vitals";
import { ComposableMenu } from "./ComposableMenu";

export const PartyMenu = () => (
  <ComposableMenu title="Party" Icon={HiOutlineUserGroup}>
    <Vitals
      name="Foo Bar"
      title="copamancer"
      stage={3}
      hp={[90, 100]}
      mp={[80, 100]}
      atb={100}
      fin={20}
    />
  </ComposableMenu>
);
