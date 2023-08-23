import { Formik, Form } from "formik";
import React from "react";
import { combineClassNames } from "../utils";
import { Board } from "../utils/Board";
import { MenuBarHeight } from "../utils/constants";
import { BoardSliceActions } from "../utils/redux/boardSlice";
import { MainSliceActions } from "../utils/redux/mainSlice";
import { useAppDispatch, useAppSelector } from "../utils/redux/store";
import { useGetCompiled } from "../utils/useGetCompiled";
import { useModal, UseModalArgs } from "../utils/useModal";
import { AppModal } from "./AppModal";
import { Divider } from "./Divider";

const NewBoardDialog = (dialog: UseModalArgs) => {
  const dispatch = useAppDispatch();

  return (
    <Formik
      initialValues={{ inputCount: 2, outputCount: 1, name: "" }}
      onSubmit={({ inputCount, outputCount, name }) => {
        if (name === "") {
          alert("Please enter a name");
          return;
        }
        if (inputCount < 1 || outputCount < 1) {
          alert("Please enter a valid number of inputs/outputs");
          return;
        }
        dispatch(MainSliceActions.setBoardOpen(true));
        dispatch(
          BoardSliceActions.initBoard({ inputCount, outputCount, name })
        );
        dialog.handleClose();
      }}
    >
      {({ values, handleChange, submitForm }) => (
        <AppModal {...dialog} heading="New gate" onSubmit={submitForm}>
          <div className="mt-2">
            <span>All unsaved changes will be lost.</span>
            <br />
            <span>Proceed with caution.</span>
          </div>
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
            "bg-yellow-400"
          )}
          onClick={() => {
            console.log(getCompiled().data);
          }}
        >
          Print compiled table
        </div>
      </div>
    </>
  );
};
