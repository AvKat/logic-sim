import { createTruthTable } from "../Board";

export const KleeneNot = createTruthTable(
  {
    "0": [2],
    "1": [1],
    "2": [0],
  },
  "KleeneNot"
);

export const KleeneAnd = createTruthTable(
  {
    "00": [0],
    "01": [0],
    "02": [0],
    "10": [0],
    "11": [1],
    "12": [1],
    "20": [0],
    "21": [1],
    "22": [2],
  },
  "KleeneAnd"
);

export const KleeneOr = createTruthTable(
  {
    "00": [0],
    "01": [1],
    "02": [2],
    "10": [1],
    "11": [1],
    "12": [2],
    "20": [2],
    "21": [2],
    "22": [2],
  },
  "KleeneOr"
);
