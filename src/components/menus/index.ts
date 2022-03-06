export * from "./ComposableMenu";
export * from "./DebugMenu";
export * from "./EntityMenu";
export * from "./PartyMenu";
export * from "./ProfileMenu";
export * from "./StuffMenu";
export * from "./TransactionMenu";

export type MenuKind =
  | "entity"
  | "debug"
  | "party"
  | "profile"
  | "stuff"
  | "transaction";
