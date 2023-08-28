import { Formik, Form } from "formik";
import React from "react";
import { v4 } from "uuid";
import { Project } from "../types";
import { MainSliceActions } from "../utils/redux/mainSlice";
import { useAppDispatch, useAppSelector } from "../utils/redux/store";
import { useModal } from "../utils/useModal";
import { AppModal } from "./AppModal";
import { Divider } from "./Divider";

interface NoCurrentProjectScreenProps {}
export const NoCurrentProjectScreen: React.FC<
  NoCurrentProjectScreenProps
> = () => {
  const initialValues: Project = {
    name: "",
    base: 2,
    availableGates: [],
  };
  const dispatch = useAppDispatch();

  const { dialog, setOpen } = useModal((dialog) => (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        dispatch(MainSliceActions.newProject(values));
        dialog.handleClose();
      }}
    >
      {({ submitForm, values, handleChange }) => (
        <AppModal {...dialog} heading="Create Project" onSubmit={submitForm}>
          <Form className="flex flex-col">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              placeholder="Project Name"
              value={values.name}
              onChange={(e) => handleChange(e)}
            />
            <label htmlFor="base">Base</label>
            <input
              id="base"
              name="base"
              placeholder="Base"
              type="number"
              value={values.base}
              onChange={(e) => handleChange(e)}
            />
          </Form>
        </AppModal>
      )}
    </Formik>
  ));

  const availableProjects = useAppSelector(
    (state) => state.project.availableProjects
  );
  return (
    <>
      {dialog}
      <div className="h-screen w-screen bg-[#353535] flex items-center justify-center flex-col overflow-hidden px-12">
        <h1 className="text-white">Select project</h1>
        <button onClick={() => setOpen(true)} className="my-7">
          New Project
        </button>
        <h2>Available Projects</h2>
        <div className="h-[40vh] overflow-y-scroll">
          <div className="w-[30vw] bold flex text-2xl">
            Name
            <div className="ml-auto">Base</div>
          </div>
          <Divider type="horizontal" />
          {availableProjects.map((project, i) => (
            <div
              key={v4()}
              onClick={() => {
                dispatch(MainSliceActions.setCurrentProject(i));
              }}
              className="w-[30vw] flex text-2xl my-4 cursor-pointer"
            >
              {project.name}
              <div className="ml-auto">{project.base}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
