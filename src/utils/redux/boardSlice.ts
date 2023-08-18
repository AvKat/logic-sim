import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BoardInitType, TruthTable } from "../Board";

type BoardState = {
  name: string;
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
    addLogicGate: (state, action: PayloadAction<[TruthTable, string]>) => {
      state.logicGates.push(action.payload);
    },
    deleteLogicGate: (state, action: PayloadAction<number>) => {
      const gateName = state.logicGates[action.payload][1];
      state.connections = state.connections.filter(
        (connection) => connection[0] !== gateName && connection[2] !== gateName
      );
      state.logicGates.splice(action.payload, 1);
    },
    addConnection: (
      state,
      action: PayloadAction<BoardState["connections"][0]>
    ) => {
      state.connections.push(action.payload);
    },
    deleteConnection: (state, action: PayloadAction<number>) => {
      state.connections.splice(action.payload, 1);
    },
    setInputCount: (state, action: PayloadAction<number>) => {
      state.inputCount = action.payload;
    },
    setOutputCount: (state, action: PayloadAction<number>) => {
      state.outputCount = action.payload;
    },
    clearData: (state) => {
      state.inputCount = 0;
      state.outputCount = 0;
      state.logicGates = [];
      state.connections = [];
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
  },
});

export default boardSlice.reducer;
export const BoardSliceActions = boardSlice.actions;
