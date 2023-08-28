import { Formik, Form } from "formik";
import React from "react";
import { combineClassNames } from "../utils";
import { MenuBarHeight } from "../utils/constants";
import { BoardSliceActions } from "../utils/redux/boardSlice";
import { MainSliceActions } from "../utils/redux/mainSlice";
import { useAppDispatch, useAppSelector } from "../utils/redux/store";
import {
  useCloseProject,
  useCurrentProject,
  useGetCompiled,
} from "../utils/reduxWrapperHooks";
import { useModal, UseModalArgs } from "../utils/useModal";
import { AppModal } from "./AppModal";
import { Divider } from "./Divider";

const NewBoardDialog = (dialog: UseModalArgs) => {
  const dispatch = useAppDispatch();
  const project = useCurrentProject();
  const base = project ? project.base : 2;
  const availableGates = project ? project.availableGates : [];
  const isGateOpen = useAppSelector((state) => state.project.boardOpen);

  return (
    <Formik
      initialValues={{ inputCount: 2, outputCount: 1, name: "" }}
      onSubmit={({ inputCount, outputCount, name }) => {
        if (name === "") {
          alert("Please enter a name");
          return;
        }
        for (let i = 0; i < availableGates.length; i++) {
          if (availableGates[i].name === name) {
            alert(`A gate with the name ${name} already exists`);
            return;
          }
        }

        if (inputCount < 1 || outputCount < 1) {
          alert("Please enter a valid number of inputs/outputs");
          return;
        }
        dispatch(MainSliceActions.setBoardOpen(true));
        dispatch(
          BoardSliceActions.initBoard({ inputCount, outputCount, name, base })
        );
        dialog.handleClose();
      }}
    >
      {({ values, handleChange, submitForm }) => (
        <AppModal {...dialog} heading="New gate" onSubmit={submitForm}>
          {isGateOpen && (
            <div className="mt-2 text-red-600 text-lg font-bold">
              <span>All unsaved changes will be lost.</span>
              <br />
              <span>Proceed with caution.</span>
            </div>
          )}
          <Divider type="horizontal" />
          <Form className="flex flex-col">
            <label className="mt-2">Name</label>
            <input
              className="mt-2"
              name="name"
              onChange={handleChange}
              value={values.name}
            />
            <label className="mt-2">Inputs</label>
            <input
              className="mt-2"
              name="numInputs"
              type="number"
              onChange={handleChange}
              value={values.inputCount}
            />
            <label className="mt-2">Outputs</label>
            <input
              className="mt-2"
              name="numOutputs"
              type="number"
              onChange={handleChange}
              value={values.outputCount}
            />
          </Form>
        </AppModal>
      )}
    </Formik>
  );
};

const MENU_BAR_BUTTON_CLASSES =
  "px-2 h-full flex justify-center items-center cursor-pointer";

interface MenuBarProps {}
export const MenuBar: React.FC<MenuBarProps> = () => {
  const { dialog: newBoardDialog, setOpen: setNewBoardDialogOpen } = useModal(
    (dialog) => <NewBoardDialog {...dialog} />
  );
  const getCompiled = useGetCompiled();
  const dispatch = useAppDispatch();
  const availableGates = useCurrentProject()!.availableGates;
  const closeProject = useCloseProject();

  const saveBoardAsGate = async () => {
    if (!getCompiled) return;
    const gate = await getCompiled();
    const sameName = availableGates.find((gate) => gate.name === gate.name);

    let message = sameName
      ? `A gate with the name ${sameName.name} already exists.\nDo you want to overwrite it?`
      : "Are you sure you want to save the board?";

    const shouldSave = confirm(message);
    if (!shouldSave) return;

    dispatch(MainSliceActions.addGate(gate));
    alert("Gate added to project");
  };

  return (
    <>
      {newBoardDialog}
      <div
        className="w-screen bg-red-400 m-0 flex items-center text-black font-bold"
        style={{ height: `${MenuBarHeight}px` }}
      >
        <div
          onClick={() => setNewBoardDialogOpen(true)}
          className={combineClassNames(MENU_BAR_BUTTON_CLASSES, "bg-lime-400")}
        >
          New board
        </div>
        <div
          className={combineClassNames(MENU_BAR_BUTTON_CLASSES, "bg-blue-400")}
          onClick={() => alert("feature not implemented yet")}
        >
          New project
        </div>
        <div
          className={combineClassNames(
            MENU_BAR_BUTTON_CLASSES,
            "bg-pink-400",
            getCompiled ? "cursor-pointer" : "cursor-not-allowed"
          )}
          onClick={saveBoardAsGate}
        >
          Save board as gate
        </div>
        <div
          className={combineClassNames(
            MENU_BAR_BUTTON_CLASSES,
            "bg-yellow-400",
            getCompiled ? "cursor-pointer" : "cursor-not-allowed"
          )}
          onClick={() => {
            getCompiled && getCompiled().then((gate) => console.log(gate));
          }}
        >
          Print compiled table
        </div>

        <div
          className={combineClassNames(MENU_BAR_BUTTON_CLASSES, "bg-gray-400")}
          onClick={() => {
            console.log(availableGates);
          }}
        >
          Print availableGates
        </div>
        <div
          className={combineClassNames(MENU_BAR_BUTTON_CLASSES, "bg-green-400")}
          onClick={() => {
            const shouldClose = confirm(
              "Are you sure you want to close the project?\nAny unsaved changes will be lost."
            );
            if (shouldClose) {
              closeProject();
            }
          }}
        >
          Close project
        </div>
        <div
          className={combineClassNames(
            MENU_BAR_BUTTON_CLASSES,
            "bg-black text-white"
          )}
          onClick={() => {
            const shouldClose = confirm(
              "Are you sure you want to close the board?\nAny unsaved changes will be lost."
            );
            if (shouldClose) {
              dispatch(MainSliceActions.setBoardOpen(false));
              dispatch(BoardSliceActions.clearData());
            }
          }}
        >
          Close board
        </div>
      </div>
    </>
  );
};
