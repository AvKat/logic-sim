import { Formik, Form } from "formik";
import React from "react";
import { MenuBarHeight } from "../utils/constants";
import { BoardSliceActions } from "../utils/redux/boardSlice";
import { MainSliceActions } from "../utils/redux/mainSlice";
import { useAppDispatch } from "../utils/redux/store";
import { useModal } from "../utils/useModal";
import { AppModal } from "./AppModal";
import { Divider } from "./Divider";

interface MenuBarProps {}
export const MenuBar: React.FC<MenuBarProps> = () => {
  const dispatch = useAppDispatch();

  const { dialog: newBoardDialog, setOpen: setNewBoardDialogOpen } = useModal(
    (dialog) => (
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
          <AppModal {...dialog} heading="Add Connection" onSubmit={submitForm}>
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
    )
  );

  return (
    <>
      {newBoardDialog}
      <div
        className="w-screen bg-red-400 m-0 flex items-center text-black font-bold"
        style={{ height: `${MenuBarHeight}px` }}
      >
        <div
          onClick={() => setNewBoardDialogOpen(true)}
          className="px-2 h-full bg-lime-400 flex justify-center items-center cursor-pointer"
        >
          New board
        </div>
        <div className="px-2 h-full bg-blue-500 flex justify-center items-center cursor-pointer">
          New project
        </div>
      </div>
    </>
  );
};
