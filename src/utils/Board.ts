import { v4 } from "uuid";
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
  id: string;
  name: string;
  input: Pin[];
  output: Pin[];

  constructor(public truthTable: TruthTable, name?: string) {
    this.id = v4();
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

export class Board {
  logicGates: Record<string, CompiledLogicGate>;
  connections: Record<string, OutputsFromBoard>;
  inputCount: number;
  outputCount: number;
  inputs: Pin[];
  outputs: Pin[];

  constructor(public name: string, public base: number = 2) {
    this.logicGates = {};
    this.connections = {};
    this.inputs = [];
    this.outputs = [];
    this.inputCount = 0;
    this.outputCount = 0;
  }

  addLogicGate(table: TruthTable, name?: string) {
    const gate = new CompiledLogicGate(table, name);
    this.logicGates[gate.id] = gate;
    this.connections[gate.id] = [];
    for (let i = 0; i < table.numInputs; i++) {
      this.connections[gate.id].push([]);
    }
    return gate.id;
  }

  addConnection(from: BoardPinNumberTuple, to: BoardPinNumberTuple) {
    let [fromGateId, fromPin] = from;
    let [toGateId, toPin] = to;

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

    this.updateOutputs(new DoublyLinkedList([[toGateId, toPin, fromOutput]]));
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

    const formatted: FrontierItem[] = firstLayerOfConnections.map(
      ([gateId, pinNumber]) => {
        return [gateId, pinNumber, nextValue];
      }
    );
    return new DoublyLinkedList(formatted);
  }

  createDefaultFrontier(): FrontierType {
    const frontier_arr: FrontierItem[] = [];
    for (let i = 0; i < this.inputs.length; i++) {
      const inputId = `input-${i}`;
      if (!this.connections[inputId]) continue;
      const firstLayerOfConnections = this.connections[inputId][0];
      const nextValue = this.inputs[i];
      for (let j = 0; j < firstLayerOfConnections.length; j++) {
        const [gateId, pinNumber] = firstLayerOfConnections[j];
        frontier_arr.push([gateId, pinNumber, nextValue]);
      }
    }
    return new DoublyLinkedList(frontier_arr);
  }

  updateOutputs(frontier: FrontierType): Pin[] {
    let i = 0;
    while (frontier.length > 0) {
      if (i++ == 1000) {
        console.error("stopping because of maximum recursion");
        break;
      }
      const [gateId, pinNumber, value] = frontier.popFirst()!;
      if (gateId.startsWith("output-")) {
        const gateNumber = parseInt(gateId.split("-")[1]);
        this.outputs[gateNumber] = value;
        continue;
      }
      const gate = this.logicGates[gateId];
      const oldOutput = gate.output;
      const newOutput = gate.setInput(pinNumber, value);
      for (let i = 0; i < oldOutput.length; i++) {
        if (oldOutput[i] !== newOutput[i]) {
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

    this.inputs = Array(this.inputs.length).fill(0);
    const truthTableData: TruthTableDataType = {};
    let i = 0;
    while (i < Math.pow(this.base, this.inputs.length)) {
      const binary = i.toString(this.base).padStart(this.inputs.length, "0");
      const inputs = binary.split("").map((x) => parseInt(x) as Pin);
      this.inputs = inputs;
      const outputs = this.updateOutputs(this.createDefaultFrontier());
      if (this.name.startsWith("Full")) {
        console.log("saving", binary, "as", outputs);
      }
      truthTableData[binary] = [...outputs];
      i++;
    }
    this.inputs = oldInputs;
    this.updateOutputs(this.createDefaultFrontier());
    return new TruthTable(truthTableData, this.name);
  }
}
