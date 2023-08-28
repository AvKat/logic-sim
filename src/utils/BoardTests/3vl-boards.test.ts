import { Board } from "../Board";
import {
  KleeneAnd,
  KleeneNot,
  KleeneOr,
} from "../BoardBuiltins/3vl-kleene-builtins";

describe("KleeneNAND testing", () => {
  test("KleeneNAND table", async () => {
    const board = new Board({
      name: "KleeneNAND",
      base: 3,
      inputCount: 2,
      outputCount: 1,
      logicGates: [
        [KleeneAnd, "a1"],
        [KleeneNot, "n1"],
      ],
      connections: [
        ["input", 0, "a1", 0],
        ["input", 1, "a1", 1],
        ["a1", 0, "n1", 0],
        ["n1", 0, "output", 0],
      ],
    });
    const table = await board.generateTruthTable();
    expect(table.data).toEqual({
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

const KleeneImplicationBoard = new Board({
  name: "KleeneImplication",
  base: 3,
  inputCount: 2,
  outputCount: 1,
  logicGates: [
    [KleeneOr, "o1"],
    [KleeneNot, "n1"],
  ],
  connections: [
    ["input", 0, "n1", 0],
    ["n1", 0, "o1", 0],
    ["input", 1, "o1", 1],
    ["o1", 0, "output", 0],
  ],
});

describe("KleeneImplication testing", () => {
  test("KleeneImplication table", async () => {
    const table = await KleeneImplicationBoard.generateTruthTable();
    expect(table.data).toEqual({
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

const KleeneImplication = await KleeneImplicationBoard.generateTruthTable();

describe("KleeneEquivalence testing", () => {
  test("KleeneEquivalence table", async () => {
    const board = new Board({
      name: "KleeneEquivalence",
      base: 3,
      inputCount: 2,
      outputCount: 1,
      logicGates: [
        [KleeneImplication, "i1"],
        [KleeneImplication, "i2"],
        [KleeneAnd, "a1"],
      ],
      connections: [
        ["input", 0, "i1", 0],
        ["input", 1, "i1", 1],
        ["input", 0, "i2", 1],
        ["input", 1, "i2", 0],
        ["i1", 0, "a1", 0],
        ["i2", 0, "a1", 1],
        ["a1", 0, "output", 0],
      ],
    });

    const table = await board.generateTruthTable();
    expect(table.data).toEqual({
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
