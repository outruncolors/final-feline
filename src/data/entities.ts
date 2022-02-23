import { foes, FoeKind } from "./foes";
import { jobs, JobKind } from "./jobs";

export const entities = {
  ...foes,
  ...jobs,
};

export type EntityKind = FoeKind | JobKind;

export interface EntityStats {
  STR: number[];
  AGI: number[];
  MAG: number[];
  STA: number[];
  HP: number[];
  MP: number[];
  ATB: number;
  FIN: number;
}
