import { Board } from "../Board";
import { AndTable, NotTable, OrTable } from "../BoardBuiltins/2vl-builtins";

const XORBoard = new Board({
  name: "XOR",
  inputCount: 2,
  outputCount: 1,
  logicGates: [
    [AndTable, "a1"],
    [AndTable, "a2"],
    [OrTable, "o1"],
    [NotTable, "n1"],
  ],
  connections: [
    ["input", 0, "a1", 0],
    ["input", 1, "a1", 1],
    ["a1", 0, "n1", 0],
    ["n1", 0, "a2", 0],
    ["input", 0, "o1", 0],
    ["input", 1, "o1", 1],
    ["o1", 0, "a2", 1],
    ["a2", 0, "output", 0],
  ],
});

const XORTable = XORBoard.generateTruthTable();

describe("XOR testing", () => {
  test("XOR board", () => {
    const board = XORBoard;

    expect(board.outputs).toEqual([0]);
    board.setInput(0, 1);
    expect(board.outputs).toEqual([1]);
    board.setInput(1, 1);
    expect(board.outputs).toEqual([0]);
  });

  test("XOR table", () => {
    expect(XORTable.data).toEqual({
      "00": [0],
      "01": [1],
      "10": [1],
      "11": [0],
    });
  });
});

const NandBoard = new Board({
  name: "NAND",
  inputCount: 2,
  outputCount: 1,
  logicGates: [
    [AndTable, "a1"],
    [NotTable, "n1"],
  ],
  connections: [
    ["input", 0, "a1", 0],
    ["input", 1, "a1", 1],
    ["a1", 0, "n1", 0],
    ["n1", 0, "output", 0],
  ],
});

const NandTable = NandBoard.generateTruthTable();

describe("NAND testing", () => {
  test("NAND board", () => {
    const board = NandBoard;

    expect(board.outputs).toEqual([1]);
    board.setInput(0, 1);
    expect(board.outputs).toEqual([1]);
    board.setInput(1, 1);
    expect(board.outputs).toEqual([0]);
  });

  test("NAND table", () => {
    expect(NandTable.data).toEqual({
      "00": [1],
      "01": [1],
      "10": [1],
      "11": [0],
    });
  });
});

const MuxBoard = new Board({
  name: "MUX",
  inputCount: 3,
  outputCount: 1,
  logicGates: [
    [AndTable, "a1"],
    [AndTable, "a2"],
    [OrTable, "o1"],
    [NotTable, "n1"],
  ],
  connections: [
    ["input", 2, "n1", 0],
    ["input", 0, "a1", 0],
    ["n1", 0, "a1", 1],
    ["input", 1, "a2", 0],
    ["input", 2, "a2", 1],
    ["a1", 0, "o1", 0],
    ["a2", 0, "o1", 1],
    ["o1", 0, "output", 0],
  ],
});

const MuxTable = MuxBoard.generateTruthTable();

describe("MUX testing", () => {
  test("MUX board", () => {
    const board = MuxBoard;

    expect(board.outputs).toEqual([0]);
    board.setInput(0, 1);
    expect(board.outputs).toEqual([1]);
    board.setInput(1, 1);
    expect(board.outputs).toEqual([1]);
    board.setInput(2, 1);
    expect(board.outputs).toEqual([1]);
    board.setInput(0, 0);
    expect(board.outputs).toEqual([1]);
    board.setInput(1, 0);
    expect(board.outputs).toEqual([0]);
    board.setInput(2, 0);
    expect(board.outputs).toEqual([0]);
  });

  test("MUX table", () => {
    expect(MuxTable.data).toEqual({
      "000": [0],
      "001": [0],
      "010": [0],
      "011": [1],
      "100": [1],
      "101": [0],
      "110": [1],
      "111": [1],
    });
  });
});

const HalfAdderBoard = new Board({
  name: "Half Adder",
  inputCount: 2,
  outputCount: 2,
  logicGates: [
    [XORTable, "xor"],
    [AndTable, "and"],
  ],
  connections: [
    ["input", 0, "xor", 0],
    ["input", 1, "xor", 1],
    ["input", 0, "and", 0],
    ["input", 1, "and", 1],
    ["and", 0, "output", 0],
    ["xor", 0, "output", 1],
  ],
});

const HalfAdderTable = HalfAdderBoard.generateTruthTable();

describe("Half Adder testing", () => {
  test("Half Adder board", () => {
    const board = HalfAdderBoard;

    expect(board.outputs).toEqual([0, 0]);
    board.setInput(0, 1);
    expect(board.outputs).toEqual([0, 1]);
    board.setInput(1, 1);
    expect(board.outputs).toEqual([1, 0]);
    board.setInput(0, 0);
    expect(board.outputs).toEqual([0, 1]);
    board.setInput(1, 0);
    expect(board.outputs).toEqual([0, 0]);
  });

  test("Half Adder table", () => {
    expect(HalfAdderTable.data).toEqual({
      "00": [0, 0],
      "01": [0, 1],
      "10": [0, 1],
      "11": [1, 0],
    });
  });
});

const FullAdderBoard = new Board({
  name: "Full Adder",
  inputCount: 3,
  outputCount: 2,
  logicGates: [
    [HalfAdderTable, "ha1"],
    [HalfAdderTable, "ha2"],
    [OrTable, "o1"],
  ],
  connections: [
    ["input", 0, "ha1", 0],
    ["input", 1, "ha1", 1],
    ["ha1", 1, "ha2", 0],
    ["input", 2, "ha2", 1],
    ["ha1", 0, "o1", 0],
    ["ha2", 0, "o1", 1],
    ["o1", 0, "output", 0],
    ["ha2", 1, "output", 1],
  ],
});

const FullAdderTable = FullAdderBoard.generateTruthTable();

describe("Full Adder testing", () => {
  test("Full Adder board", () => {
    const board = FullAdderBoard;

    expect(board.outputs).toEqual([0, 0]);
    board.setInput(0, 1);
    expect(board.outputs).toEqual([0, 1]);
    board.setInput(1, 1);
    expect(board.outputs).toEqual([1, 0]);
    board.setInput(2, 1);
    expect(board.outputs).toEqual([1, 1]);
    board.setInput(0, 0);
    board.setInput(2, 0);
    expect(board.outputs).toEqual([0, 1]);
  });

  test("Full Adder table", () => {
    expect(FullAdderTable.data).toEqual({
      "000": [0, 0],
      "001": [0, 1],
      "010": [0, 1],
      "011": [1, 0],
      "100": [0, 1],
      "101": [1, 0],
      "110": [1, 0],
      "111": [1, 1],
    });
  });
});
