import { Board, CompiledLogicGate, TruthTableDataType } from "./Board";

const AndTable: TruthTableDataType = {
  "00": [0],
  "01": [0],
  "10": [0],
  "11": [1],
};

const OrTable: TruthTableDataType = {
  "00": [0],
  "01": [1],
  "10": [1],
  "11": [1],
};

const NotTable: TruthTableDataType = {
  "0": [1],
  "1": [0],
};

export { AndTable, OrTable, NotTable };
