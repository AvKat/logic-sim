import { Board } from "../Board";
import {
  KleeneAnd,
  KleeneNot,
  KleeneOr,
} from "../BoardBuiltins/3vl-kleene-builtins";

describe("KleeneNAND testing", () => {
  test("KleeneNAND table", () => {
    const board = new Board("KleeneNAND", 3);
    const a = board.addInput();
    const b = board.addInput();
    const o = board.addOutput();

    const a1 = board.addLogicGate(KleeneAnd, "a1");
    const n1 = board.addLogicGate(KleeneNot, "n1");

    board.addConnection([a, 0], [a1, 0]);
    board.addConnection([b, 0], [a1, 1]);

    board.addConnection([a1, 0], [n1, 0]);
    board.addConnection([n1, 0], [o, 0]);
    expect(board.generateTruthTable().data).toEqual({
      "00": [2],
      "01": [2],
      "02": [2],
      "10": [2],
      "11": [1],
      "12": [1],
      "20": [2],
      "21": [1],
      "22": [0],
    });
  });
});

const createKleeneImplicationBoard = () => {
  const board = new Board("KleeneImplication", 3);

  const a = board.addInput();
  const b = board.addInput();
  const o = board.addOutput();

  const o1 = board.addLogicGate(KleeneOr, "a1");
  const n1 = board.addLogicGate(KleeneNot, "n1");

  board.addConnection([a, 0], [n1, 0]);
  board.addConnection([n1, 0], [o1, 0]);
  board.addConnection([b, 0], [o1, 1]);
  board.addConnection([o1, 0], [o, 0]);

  return board;
};

describe("KleeneImplication testing", () => {
  test("KleeneImplication table", () => {
    const board = createKleeneImplicationBoard();
    expect(board.generateTruthTable().data).toEqual({
      "00": [2],
      "01": [2],
      "02": [2],
      "10": [1],
      "11": [1],
      "12": [2],
      "20": [0],
      "21": [1],
      "22": [2],
    });
  });
});

const KleeneImplication = createKleeneImplicationBoard().generateTruthTable();

const createKleeneEquivalenceBoard = () => {
  const board = new Board("KleeneEquivalence", 3);

  const a = board.addInput();
  const b = board.addInput();
  const o = board.addOutput();

  const a1 = board.addLogicGate(KleeneAnd, "a1");
  const i1 = board.addLogicGate(KleeneImplication, "i1");
  const i2 = board.addLogicGate(KleeneImplication, "i2");

  board.addConnection([a, 0], [i1, 0]);
  board.addConnection([b, 0], [i1, 1]);

  board.addConnection([b, 0], [i2, 0]);
  board.addConnection([a, 0], [i2, 1]);

  board.addConnection([i1, 0], [a1, 0]);
  board.addConnection([i2, 0], [a1, 1]);
  board.addConnection([a1, 0], [o, 0]);

  return board;
};

describe("KleeneEquivalence testing", () => {
  test("KleeneEquivalence table", () => {
    const board = createKleeneEquivalenceBoard();
    expect(board.generateTruthTable().data).toEqual({
      "00": [2],
      "01": [1],
      "02": [0],
      "10": [1],
      "11": [1],
      "12": [1],
      "20": [0],
      "21": [1],
      "22": [2],
    });
  });
});
