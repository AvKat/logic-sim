import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Project } from "../../types";
import { AndTable, NotTable, OrTable } from "../BoardBuiltins/2vl-builtins";

type MainState = {
  currentProject?: Project;
  availableProjects: Project[];
};

const defaultTestProject: Project = {
  name: "Test Project",
  base: 2,
  availableGates: [AndTable, OrTable, NotTable],
};

const initialState: MainState = {
  availableProjects: [defaultTestProject],
  currentProject: defaultTestProject,
};

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    setCurrentProject: (state, action: PayloadAction<Project>) => {
      state.currentProject = action.payload;
    },
    newProject: (state, action: PayloadAction<Project>) => {
      state.availableProjects.push(action.payload);
      state.currentProject = action.payload;
      console.log(state.currentProject);
    },
    clearData: (state) => {
      state.currentProject = undefined;
      state.availableProjects = [];
    },
  },
});

export default mainSlice.reducer;
export const MainSliceActions = mainSlice.actions;
