import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Project } from "../../types";
import { TruthTable } from "../Board";
import { AndTable, NotTable, OrTable } from "../BoardBuiltins/2vl-builtins";

type MainState = {
  currentProjectIndex?: number;
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
  currentProjectIndex: undefined,
  boardOpen: false,
};

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    setCurrentProject: (state, action: PayloadAction<number>) => {
      return { ...state, currentProjectIndex: action.payload };
    },
    newProject: (state, action: PayloadAction<Project>) => {
      const newAvailableProjects = [...state.availableProjects, action.payload];
      return {
        ...state,
        availableProjects: newAvailableProjects,
        currentProjectIndex: newAvailableProjects.length - 1,
      };
    },
    clearData: (state) => {
      return {
        ...state,
        currentProjectIndex: undefined,
        availableProjects: [],
      };
    },
    closeProject: (state) => {
      return {
        ...state,
        currentProjectIndex: undefined,
      };
    },
    setBoardOpen: (state, action: PayloadAction<boolean>) => {
      return { ...state, boardOpen: action.payload };
    },
    addGate: (state, action: PayloadAction<TruthTable>) => {
      return {
        ...state,
        availableProjects: state.availableProjects.map((project, index) => {
          if (index !== state.currentProjectIndex) {
            return project;
          }

          const sameGate = project.availableGates.find(
            (gate) => gate.name === action.payload.name
          );
          let newAvailableGates: TruthTable[];
          if (sameGate) {
            newAvailableGates = project.availableGates.map((gate) => {
              if (gate.name === action.payload.name) {
                return action.payload;
              }
              return gate;
            });
          } else {
            newAvailableGates = [...project.availableGates, action.payload];
          }
          return {
            ...project,
            availableGates: newAvailableGates,
          };
        }),
      };
    },
  },
});

export default mainSlice.reducer;
export const MainSliceActions = mainSlice.actions;
