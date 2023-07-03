import { Board } from "./Board";
import { AndTable, OrTable, NotTable } from "./Builtins";

// We create boards like this so that tesing can be done in one place
const createXORBoard = () => {
  const board = new Board("XOR");
  const a = board.addInput();
  const b = board.addInput();
  const o = board.addOutput();

  const a1 = board.addLogicGate(AndTable, "a1");
  const a2 = board.addLogicGate(AndTable, "a2");
  const o1 = board.addLogicGate(OrTable, "o1");
  const n1 = board.addLogicGate(NotTable, "n1");

  board.addConnection([a, 0], [o1, 0]);
  board.addConnection([b, 0], [o1, 1]);

  board.addConnection([a, 0], [a1, 0]);
  board.addConnection([b, 0], [a1, 1]);

  board.addConnection([a1, 0], [n1, 0]);
  board.addConnection([o1, 0], [a2, 0]);
  board.addConnection([n1, 0], [a2, 1]);
  board.addConnection([a2, 0], [o, 0]);
  return board;
};

const XORTable = createXORBoard().generateTruthTable();

describe("XOR testing", () => {
  test("XOR board", () => {
    const board = createXORBoard();

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

const createNandBoard = () => {
  const board = new Board("NAND");
  const a = board.addInput();
  const b = board.addInput();
  const o = board.addOutput();

  const a1 = board.addLogicGate(AndTable, "a1");
  const n1 = board.addLogicGate(NotTable, "n1");

  board.addConnection([a, 0], [a1, 0]);
  board.addConnection([b, 0], [a1, 1]);

  board.addConnection([a1, 0], [n1, 0]);
  board.addConnection([n1, 0], [o, 0]);
  return board;
};

const NandTable = createNandBoard().generateTruthTable();

describe("NAND testing", () => {
  test("NAND board", () => {
    const board = createNandBoard();

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

const createMuxBoard = () => {
  const board = new Board("MUX");
  const a = board.addInput();
  const b = board.addInput();
  const s = board.addInput();
  const o = board.addOutput();

  const a1 = board.addLogicGate(AndTable, "a1");
  const a2 = board.addLogicGate(AndTable, "a2");
  const o1 = board.addLogicGate(OrTable, "o1");
  const n1 = board.addLogicGate(NotTable, "n1");

  board.addConnection([s, 0], [n1, 0]);
  board.addConnection([a, 0], [a1, 0]);
  board.addConnection([n1, 0], [a1, 1]);

  board.addConnection([b, 0], [a2, 0]);
  board.addConnection([s, 0], [a2, 1]);

  board.addConnection([a1, 0], [o1, 0]);
  board.addConnection([a2, 0], [o1, 1]);

  board.addConnection([o1, 0], [o, 0]);
  return board;
};

const MuxTable = createMuxBoard().generateTruthTable();

describe("MUX testing", () => {
  test("MUX board", () => {
    const board = createMuxBoard();

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

const createHalfAdderBoard = () => {
  const board = new Board("Half Adder");
  const a = board.addInput();
  const b = board.addInput();
  const cout = board.addOutput();
  const sum = board.addOutput();

  const x1 = board.addLogicGate(XORTable, "x1");
  const a1 = board.addLogicGate(AndTable, "a1");

  board.addConnection([a, 0], [x1, 0]);
  board.addConnection([b, 0], [x1, 1]);
  board.addConnection([x1, 0], [sum, 0]);

  board.addConnection([a, 0], [a1, 0]);
  board.addConnection([b, 0], [a1, 1]);
  board.addConnection([a1, 0], [cout, 0]);

  return board;
};

const HalfAdderTable = createHalfAdderBoard().generateTruthTable();

describe("Half Adder testing", () => {
  test("Half Adder board", () => {
    const board = createHalfAdderBoard();

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

const createFullAdderBoard = () => {
  const board = new Board("Full Adder");
  const a = board.addInput();
  const b = board.addInput();
  const cin = board.addInput();
  const cout = board.addOutput();
  const sum = board.addOutput();

  const ha1 = board.addLogicGate(HalfAdderTable, "ha1");
  const ha2 = board.addLogicGate(HalfAdderTable, "ha2");
  const o1 = board.addLogicGate(OrTable, "o1");

  board.addConnection([a, 0], [ha1, 0]);
  board.addConnection([b, 0], [ha1, 1]);

  board.addConnection([ha1, 1], [ha2, 0]);
  board.addConnection([cin, 0], [ha2, 1]);

  board.addConnection([ha1, 0], [o1, 0]);
  board.addConnection([ha2, 0], [o1, 1]);

  board.addConnection([ha2, 1], [sum, 0]);
  board.addConnection([o1, 0], [cout, 0]);

  return board;
};

const FullAdderTable = createFullAdderBoard().generateTruthTable();

describe("Full Adder testing", () => {
  test("Full Adder board", () => {
    const board = createFullAdderBoard();
    console.log("----------------------------------");

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

  // console.log("full adder:", FullAdderTable.data);

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
