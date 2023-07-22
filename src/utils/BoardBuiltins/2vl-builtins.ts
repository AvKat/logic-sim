import { TruthTable } from "../Board";

const AndTable = new TruthTable(
  {
    "00": [0],
    "01": [0],
    "10": [0],
    "11": [1],
  },
  "AND"
);

const OrTable = new TruthTable(
  {
    "00": [0],
    "01": [1],
    "10": [1],
    "11": [1],
  },
  "OR"
);

const NotTable = new TruthTable(
  {
    "0": [1],
    "1": [0],
  },
  "NOT"
);

export { AndTable, OrTable, NotTable };
