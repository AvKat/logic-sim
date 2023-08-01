import { TruthTable } from "./utils/Board";

export type Project = {
  name: string;
  base: number;
  availableGates: TruthTable[];
};
