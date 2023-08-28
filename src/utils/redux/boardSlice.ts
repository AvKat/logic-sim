import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BoardInitType, TruthTable } from "../Board";

type BoardState = {
  name: string;
  base?: number;
  inputCount: Required<BoardInitType>["inputCount"];
  outputCount: Required<BoardInitType>["outputCount"];
  logicGates: Required<BoardInitType>["logicGates"];
  connections: Required<BoardInitType>["connections"];
};
const initialState: BoardState = {
  name: "",
  inputCount: 0,
  outputCount: 0,
  logicGates: [],
  connections: [],
};

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    initBoard: (
      state,
      action: PayloadAction<
        Pick<BoardState, "name" | "inputCount" | "outputCount" | "base">
      >
    ) => {
      return {
        ...state,
        name: action.payload.name,
        base: action.payload.base,
        inputCount: action.payload.inputCount,
        outputCount: action.payload.outputCount,
        logicGates: [],
        connections: [],
      };
    },
    addLogicGate: (state, action: PayloadAction<[TruthTable, string]>) => {
      return { ...state, logicGates: [...state.logicGates, action.payload] };
    },
    deleteLogicGate: (state, action: PayloadAction<number>) => {
      const gateName = state.logicGates[action.payload][1];
      const connections = state.connections.filter(
        (connection) => connection[0] !== gateName && connection[2] !== gateName
      );
      const logicGates = state.logicGates.filter(
        (_, index) => index !== action.payload
      );

      return {
        ...state,
        connections,
        logicGates,
      };
    },
    addConnection: (
      state,
      action: PayloadAction<BoardState["connections"][0]>
    ) => {
      return { ...state, connections: [...state.connections, action.payload] };
    },
    deleteConnection: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        connections: state.connections.filter(
          (_, index) => index !== action.payload
        ),
      };
    },
    setInputCount: (state, action: PayloadAction<number>) => {
      return { ...state, inputCount: action.payload };
    },
    setOutputCount: (state, action: PayloadAction<number>) => {
      return { ...state, outputCount: action.payload };
    },
    clearData: () => {
      return { ...initialState };
    },
    setName: (state, action: PayloadAction<string>) => {
      return { ...state, name: action.payload };
    },
  },
});

export default boardSlice.reducer;
export const BoardSliceActions = boardSlice.actions;
