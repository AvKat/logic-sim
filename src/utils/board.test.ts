import { Board } from "./Board";
import { CompiledLogicGate } from "./Board";
import { TruthTableDataType } from "./Board";
import { AndTable, OrTable, NotTable } from "./Builtins";

// We create boards like this so that tesing can be done in one place
const createXORBoard = () => {
  const board = new Board();
  const a = board.addInput();
  const b = board.addInput();
  const o = board.addOutput();

  const a1 = new CompiledLogicGate(AndTable, "a1");
  const a2 = new CompiledLogicGate(AndTable, "a2");
  const o1 = new CompiledLogicGate(OrTable, "o1");
  const n1 = new CompiledLogicGate(NotTable, "n1");

  board.addLogicGate(a1);
  board.addLogicGate(a2);
  board.addLogicGate(o1);
  board.addLogicGate(n1);

  board.addConnection([a, 0], [o1, 0]);
  board.addConnection([b, 0], [o1, 1]);

  board.addConnection([a, 0], [a1, 0]);
  board.addConnection([b, 0], [a1, 1]);

  board.addConnection([a1, 0], [n1, 0]);
  board.addConnection([n1, 0], [a2, 0]);
  board.addConnection([o1, 0], [a2, 1]);
  board.addConnection([a2, 0], [o, 0]);
  return board;
};

const XORTable: TruthTableDataType = createXORBoard().generateTruthTable();

const createNandBoard = () => {
  const board = new Board();
  const a = board.addInput();
  const b = board.addInput();
  const o = board.addOutput();

  const a1 = new CompiledLogicGate(AndTable, "a1");
  const n1 = new CompiledLogicGate(NotTable, "n1");

  board.addLogicGate(a1);
  board.addLogicGate(n1);

  board.addConnection([a, 0], [a1, 0]);
  board.addConnection([b, 0], [a1, 1]);

  board.addConnection([a1, 0], [n1, 0]);
  board.addConnection([n1, 0], [o, 0]);
  return board;
};

const NandTable: TruthTableDataType = createNandBoard().generateTruthTable();

describe("Basic board testing", () => {
  test("XOR board", () => {
    const board = createXORBoard();

    expect(board.outputs).toEqual([0]);
    board.setInput(0, 1);
    expect(board.outputs).toEqual([1]);
    board.setInput(1, 1);
    expect(board.outputs).toEqual([0]);
  });

  test("XOR table", () => {
    expect(XORTable).toEqual({
      "00": [0],
      "01": [1],
      "10": [1],
      "11": [0],
    });
  });

  test("NAND board", () => {
    const board = createNandBoard();

    expect(board.outputs).toEqual([1]);
    board.setInput(0, 1);
    expect(board.outputs).toEqual([1]);
    board.setInput(1, 1);
    expect(board.outputs).toEqual([0]);
  });

  test("NAND table", () => {
    expect(NandTable).toEqual({
      "00": [1],
      "01": [1],
      "10": [1],
      "11": [0],
    });
  });
});
