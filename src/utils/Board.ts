import { DoublyLinkedList } from "./DoubleLinkedList";

export type Pin = number;
export type TruthTableDataType = Record<string, Pin[]>;

export class TruthTable {
  data: TruthTableDataType;
  numInputs: number;

  constructor(from: TruthTableDataType, public name: string) {
    const firstEntry = Object.entries(from)[0];
    this.numInputs = firstEntry[0].length;
    this.data = from;
  }

  getOutput(input: Pin[]): Pin[] {
    const inputString = input.join("");
    return this.data[inputString];
  }
}

export class CompiledLogicGate {
  name: string;
  input: Pin[];
  output: Pin[];

  constructor(public truthTable: TruthTable, name?: string) {
    this.name = name || truthTable.name;
    this.input = Array(this.truthTable.numInputs).fill(0);
    this.output = this.truthTable.getOutput(this.input);
  }

  setInput(index: number, value: Pin) {
    this.input[index] = value;
    this.output = this.truthTable.getOutput(this.input);
    return this.output;
  }
}

export type BoardPinNumberTuple = [string, number];
export type OutputsFromBoard = BoardPinNumberTuple[][];
type FrontierItem = [string, number, Pin];
type FrontierType = DoublyLinkedList<FrontierItem>;

type BoardInitType = {
  name: string;
  base?: number;
  inputCount: number;
  outputCount: number;
  logicGates?: [TruthTable, string][];
  connections?: [...BoardPinNumberTuple, ...BoardPinNumberTuple][];
};

export class Board {
  logicGates: Record<string, CompiledLogicGate>;
  connections: Record<string, OutputsFromBoard>;
  inputCount: number;
  outputCount: number;
  inputs: Pin[];
  outputs: Pin[];
  base: number;
  name: string;

  constructor({
    name,
    base = 2,
    inputCount,
    outputCount,
    logicGates = [],
    connections = [],
  }: BoardInitType) {
    // Error if duplicate logic gate names
    const logicGatesSorted = logicGates.sort(([_, aName], [__, bName]) =>
      aName.localeCompare(bName)
    );
    for (let i = 0; i < logicGatesSorted.length - 1; i++) {
      if (logicGatesSorted[i][1] === logicGatesSorted[i + 1][1]) {
        throw new Error("Duplicate logic gate name");
      }
    }
    this.name = name;
    this.base = base;
    this.inputCount = inputCount;
    this.outputCount = outputCount;
    this.inputs = Array(inputCount).fill(0);
    this.outputs = Array(outputCount).fill(0);

    // Add logic gates
    this.logicGates = {};
    logicGates.forEach(([table, name]) => {
      this.logicGates[name] = new CompiledLogicGate(table, name);
    });

    // Add connections
    this.connections = {};
    connections.forEach(([fromID, fromPin, toID, toPin]) => {
      this.addConnection([fromID, fromPin], [toID, toPin]);
    });

    this.updateOutputs(this.createDefaultFrontier(), true);
  }

  addConnection(from: BoardPinNumberTuple, to: BoardPinNumberTuple) {
    let [fromGateId, fromPin] = from;
    let [toGateId, toPin] = to;

    if (!this.connections[fromGateId]) this.connections[fromGateId] = [];
    if (!this.connections[fromGateId][fromPin])
      this.connections[fromGateId][fromPin] = [];

    this.connections[fromGateId][fromPin].push([toGateId, toPin]);

    let fromOutput =
      fromGateId === "input"
        ? this.inputs[fromPin]
        : this.logicGates[fromGateId].output[fromPin];
    if (toGateId === "output") {
      this.outputs[toPin] = fromOutput;
    } else {
      this.logicGates[toGateId].input[toPin] = fromOutput;
    }
  }

  setInput(index: number, value: Pin) {
    this.inputs[index] = value;
    return this.updateOutputs(this.createFrontierForSingleInput(index));
  }

  createFrontierForSingleInput(starterIndex: number): FrontierType {
    // input pins only have 1 output pin
    const firstLayerOfConnections = this.connections["input"][starterIndex];
    const nextValue = this.inputs[starterIndex];

    const formatted: FrontierItem[] = firstLayerOfConnections.map(
      ([gateId, pinNumber]) => {
        return [gateId, pinNumber, nextValue];
      }
    );
    return new DoublyLinkedList(formatted);
  }

  createDefaultFrontier(): FrontierType {
    const frontierArr: FrontierItem[] = [];
    for (let i = 0; i < this.inputs.length; i++) {
      if (!this.connections["input"]) continue;
      const firstLayerOfConnections = this.connections["input"][i];
      const nextValue = this.inputs[i];
      for (let j = 0; j < firstLayerOfConnections.length; j++) {
        const [gateId, pinNumber] = firstLayerOfConnections[j];
        frontierArr.push([gateId, pinNumber, nextValue]);
      }
    }
    return new DoublyLinkedList(frontierArr);
  }

  updateOutputs(frontier: FrontierType, force = false): Pin[] {
    let i = 0;
    while (frontier.length > 0) {
      if (i++ == 1000) {
        console.error("stopping because of maximum recursion");
        break;
      }
      const [gateId, pinNumber, value] = frontier.popFirst()!;
      if (gateId === "output") {
        this.outputs[pinNumber] = value;
        continue;
      }
      const gate = this.logicGates[gateId];
      const oldOutput = gate.output;
      const newOutput = gate.setInput(pinNumber, value);
      for (let i = 0; i < oldOutput.length; i++) {
        if (oldOutput[i] !== newOutput[i] || force) {
          const nextGates = this.connections[gateId][i];
          nextGates.forEach(([ngate, nindex]) => {
            frontier.append([ngate, nindex, newOutput[i]]);
          });
        }
      }
    }
    return this.outputs;
  }

  generateTruthTable(): TruthTable {
    const oldInputs = this.inputs;

    this.inputs = Array(this.inputCount).fill(0);
    const truthTableData: TruthTableDataType = {};
    for (let i = 0; i < Math.pow(this.base, this.inputCount); i++) {
      const key = i.toString(this.base).padStart(this.inputs.length, "0");
      const inputs = key.split("").map((x) => parseInt(x) as Pin);
      this.inputs = inputs;
      const outputs = this.updateOutputs(this.createDefaultFrontier());
      truthTableData[key] = [...outputs];
    }
    this.inputs = oldInputs;
    this.updateOutputs(this.createDefaultFrontier());
    return new TruthTable(truthTableData, this.name);
  }
}
