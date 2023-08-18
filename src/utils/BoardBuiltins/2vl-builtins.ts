import { createTruthTable } from "../Board";

const AndTable = createTruthTable(
  {
    "00": [0],
    "01": [0],
    "10": [0],
    "11": [1],
  },
  "AND"
);

const OrTable = createTruthTable(
  {
    "00": [0],
    "01": [1],
    "10": [1],
    "11": [1],
  },
  "OR"
);

const NotTable = createTruthTable(
  {
    "0": [1],
    "1": [0],
  },
  "NOT"
);

export { AndTable, OrTable, NotTable };
