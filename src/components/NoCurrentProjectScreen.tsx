import { Formik, Form } from "formik";
import React from "react";
import { v4 } from "uuid";
import { Project } from "../types";
import { MainSliceActions } from "../utils/redux/mainSlice";
import { useAppDispatch, useAppSelector } from "../utils/redux/store";
import { useDialog } from "../utils/useModal";
import { AppModal } from "./AppModal";

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

  const { dialog, setOpen } = useDialog((dialog) => (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        dispatch(MainSliceActions.newProject(values));
        dialog.handleClose();
      }}
    >
      {({ submitForm, values, handleChange }) => (
        <AppModal {...dialog} heading="Create Project" onSubmit={submitForm}>
          <Form
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
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
      <div
        style={{
          height: `100vh`,
          width: "100vw",
          backgroundColor: "#353535",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          padding: "50px 0px",
        }}
      >
        <h1 style={{ color: "white" }}>Select project</h1>
        <button onClick={() => setOpen(true)}>New Project</button>
        <h3>Available Projects</h3>
        <div
          style={{
            height: "40vh",
            overflowY: "scroll",
          }}
        >
          {availableProjects.map((project) => (
            <div key={v4()}>{project.name}</div>
          ))}
        </div>
      </div>
    </>
  );
};
