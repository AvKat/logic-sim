import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Project } from "../../types";
import { AndTable, NotTable, OrTable } from "../BoardBuiltins/2vl-builtins";

type MainState = {
  currentProject?: Project;
  availableProjects: Project[];
  boardOpen: boolean;
};

const defaultTestProject: Project = {
  name: "Test Project",
  base: 2,
  availableGates: [AndTable, OrTable, NotTable],
};

const initialState: MainState = {
  availableProjects: [defaultTestProject],
  currentProject: defaultTestProject,
  boardOpen: false,
};

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    setCurrentProject: (state, action: PayloadAction<Project>) => {
      return { ...state, currentProject: action.payload };
    },
    newProject: (state, action: PayloadAction<Project>) => {
      return {
        ...state,
        availableProjects: [...state.availableProjects, action.payload],
        currentProject: action.payload,
      };
    },
    clearData: (state) => {
      return {
        ...state,
        currentProject: undefined,
        availableProjects: [],
      };
    },
    closeProject: (state) => {
      return {
        ...state,
        currentProject: undefined,
      };
    },
    setBoardOpen: (state, action: PayloadAction<boolean>) => {
      return { ...state, boardOpen: action.payload };
    },
  },
});

export default mainSlice.reducer;
export const MainSliceActions = mainSlice.actions;
