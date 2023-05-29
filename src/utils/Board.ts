import { v4 } from "uuid";

const debug = false;

const dp = (...args: any[]) => {
  if (debug) console.log(...args);
};

export type Pin = 0 | 1;
export type TruthTableDataType = Record<string, Pin[]>;

export class TruthTable {
  data: TruthTableDataType;
  numInputs: number;

  constructor(from: TruthTableDataType) {
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
  id: string;
  truthTable: TruthTable;
  input: Pin[];
  output: Pin[];

  constructor(table: TruthTableDataType, public name?: string) {
    this.id = v4();
    this.truthTable = new TruthTable(table);
    this.input = Array(this.truthTable.numInputs).fill(0);
    this.output = this.truthTable.getOutput(this.input);
  }
}

export type BoardPinNumberTuple = [string, number];
export type BoardPinNumberTupleExtended = [string | CompiledLogicGate, number];
export type OutputsFromBoard = BoardPinNumberTuple[][];
type FrontierType = Array<[string, number, Pin]>;

export class Board {
  logicGates: Record<string, CompiledLogicGate>;
  connections: Record<string, OutputsFromBoard>;
  inputCount: number;
  outputCount: number;
  inputs: Pin[];
  outputs: Pin[];

  constructor(public base: number = 2) {
    this.logicGates = {};
    this.connections = {};
    this.inputs = [];
    this.outputs = [];
    this.inputCount = 0;
    this.outputCount = 0;
  }

  addLogicGate(gate: CompiledLogicGate) {
    this.logicGates[gate.id] = gate;
    this.connections[gate.id] = Array(gate.truthTable.numInputs).fill([]);
  }

  getNameSafe(gateId: string) {
    return this.logicGates[gateId]?.name || gateId;
  }

  addConnection(
    from: BoardPinNumberTupleExtended,
    to: BoardPinNumberTupleExtended
  ) {
    let [fromGateId, fromPin] = from;
    if (typeof fromGateId !== "string") fromGateId = fromGateId.id;
    let [toGateId, toPin] = to;
    if (typeof toGateId !== "string") toGateId = toGateId.id;

    if (!this.connections[fromGateId]) this.connections[fromGateId] = [];
    if (!this.connections[fromGateId][fromPin])
      this.connections[fromGateId][fromPin] = [];

    this.connections[fromGateId][fromPin].push([toGateId, toPin]);

    let fromOutput = fromGateId.startsWith("input-")
      ? this.inputs[parseInt(fromGateId.split("-")[1])]
      : this.logicGates[fromGateId].output[fromPin];
    if (toGateId.startsWith("output-")) {
      this.outputs[parseInt(toGateId.split("-")[1])] = fromOutput;
    } else {
      this.logicGates[toGateId].input[toPin] = fromOutput;
    }

    this.updateOutputs([[toGateId, toPin, fromOutput]]);
    dp(
      "Added connection from",
      this.getNameSafe(fromGateId),
      fromPin,
      "to",
      this.getNameSafe(toGateId),
      toPin,
      "with value",
      fromOutput
    );
  }

  addInput() {
    this.inputs.push(0);
    const inputId = `input-${this.inputCount++}`;
    this.connections[inputId] = [[]];
    return inputId;
  }

  addOutput() {
    this.outputs.push(0);
    return `output-${this.outputCount++}`;
  }

  setInput(index: number, value: Pin) {
    this.inputs[index] = value;
    return this.updateOutputs(this.createFrontierForSingleInput(index));
  }

  createFrontierForSingleInput(starterIndex: number): FrontierType {
    // input pins only have 1 output pin
    const inputId = `input-${starterIndex}`;
    const firstLayerOfConnections = this.connections[inputId][0];
    const nextValue = this.inputs[starterIndex];

    return firstLayerOfConnections.map(([gateId, pinNumber]) => {
      return [gateId, pinNumber, nextValue];
    });
  }

  createDefaultFrontier(): FrontierType {
    const frontier: FrontierType = [];
    for (let i = 0; i < this.inputs.length; i++) {
      const inputId = `input-${i}`;
      if (!this.connections[inputId]) continue;
      const firstLayerOfConnections = this.connections[inputId][0];
      const nextValue = this.inputs[i];
      for (let j = 0; j < firstLayerOfConnections.length; j++) {
        const [gateId, pinNumber] = firstLayerOfConnections[j];
        frontier.push([gateId, pinNumber, nextValue]);
      }
    }
    return frontier;
  }

  updateOutputs(frontier: FrontierType) {
    let i = 0;
    const updateSingleGate = (
      gateId: string,
      pinNumber: number,
      value: Pin
    ) => {
      dp("aaa", this.logicGates[gateId]?.name || gateId, pinNumber, value);
      if (gateId.startsWith("output-")) {
        // dp(gateId, pinNumber, value);
        this.outputs[parseInt(gateId.split("-")[1])] = value;
        return;
      }
      const gate = this.logicGates[gateId];
      const oldOutput = gate.output;
      gate.input[pinNumber] = value;
      gate.output = gate.truthTable.getOutput(gate.input);
      dp(gate.input, oldOutput, gate.output);
      for (let i = 0; i < gate.output.length; i++) {
        if (gate.output[i] !== oldOutput[i]) {
          const nextGates = this.connections[gateId][i];
          for (const nextGate of nextGates) {
            const [nextGateId, nextPinNumber] = nextGate;
            frontier.push([nextGateId, nextPinNumber, gate.output[i]]);
          }
        }
      }
    };

    while (frontier.length > 0 && i++ < 100) {
      dp("Frontier start");
      for (let i = 0; i < frontier.length; i++) {
        const id = frontier[i][0];
        dp(this.logicGates[id]?.name || id, frontier[i][1], frontier[i][2]);
      }
      dp("Frontier unstart");

      const [gateId, pinNumber, nextValue] = frontier.shift()!;
      // dp("Handling gate:", gateId, pinNumber);
      // const gate = this.logicGates[gateId];
      // dp("bbbbb", gate.name || "random-b", pinNumber, nextValue);
      updateSingleGate(gateId, pinNumber, nextValue);
    }

    return this.outputs;
  }

  generateTruthTable() {
    const oldInputs = this.inputs;

    this.inputs = Array(this.inputs.length).fill(0);
    const truthTableData: TruthTableDataType = {};
    let i = 0;
    while (i < Math.pow(this.base, this.inputs.length)) {
      const binary = i.toString(this.base).padStart(this.inputs.length, "0");
      const inputs = binary.split("").map((x) => parseInt(x) as Pin);
      this.inputs = inputs;
      const outputs = this.updateOutputs(this.createDefaultFrontier());
      truthTableData[binary] = [...outputs];
      i++;
    }
    this.inputs = oldInputs;
    this.updateOutputs(this.createDefaultFrontier());
    return truthTableData;
  }
}
