import { useEffect } from "react";
import "./App.css";
import { Board, CompiledLogicGate, TruthTableDataType } from "./utils/Board";

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

// s & a || -s & b

const App = () => {
  useEffect(() => {
    const board = new Board();
    const a = board.addInput();
    const b = board.addInput();
    const o = board.addOutput();

    const a1 = new CompiledLogicGate(AndTable, "and1");
    const a2 = new CompiledLogicGate(AndTable, "and2");
    const n1 = new CompiledLogicGate(NotTable, "not1");
    const n2 = new CompiledLogicGate(NotTable, "not2");
    const o1 = new CompiledLogicGate(OrTable, "or1");

    board.addLogicGate(a1);
    board.addLogicGate(a2);
    board.addLogicGate(n1);
    board.addLogicGate(n2);
    board.addLogicGate(o1);

    board.addConnection([a, 0], [a1, 0]);
    board.addConnection([b, 0], [a1, 1]);

    board.addConnection([a, 0], [n1, 0]);
    board.addConnection([b, 0], [n2, 0]);

    board.addConnection([n1, 0], [a2, 0]);
    board.addConnection([n2, 0], [a2, 1]);

    board.addConnection([a1, 0], [o1, 0]);
    board.addConnection([a2, 0], [o1, 1]);

    board.addConnection([o1, 0], [o, 0]);

    console.log("board outputs 0: ", board.outputs);
    board.setInput(0, 1);
    console.log("board outputs 1", board.outputs);
    console.log("change 2");
    board.setInput(1, 1);

    console.log("board outputs 2", board.outputs);
    console.log("------------------------------------");
  });

  return <h1>Hello</h1>;
};

export default App;
