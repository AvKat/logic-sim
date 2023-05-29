import { Board, CompiledLogicGate } from "./Board";
import { AndTable, NotTable, OrTable } from "./Builtins";

test("XOR gate", () => {
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

  expect(board.outputs).toEqual([1]);
  board.setInput(0, 1);
  expect(board.outputs).toEqual([0]);
  board.setInput(1, 1);
  expect(board.outputs).toEqual([1]);
});
