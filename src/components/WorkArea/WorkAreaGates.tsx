import { Form, Formik } from "formik";
import React from "react";
import { BoardSliceActions } from "../../utils/redux/boardSlice";
import { useAppDispatch, useAppSelector } from "../../utils/redux/store";
import { useCurrentProject } from "../../utils/reduxWrapperHooks";
import { UseModalArgs } from "../../utils/useModal";
import { AppModal } from "../AppModal";
import { WorkAreaSection } from "./WorkAreaSection";

const AddGateModal: React.FC<UseModalArgs> = (dialog) => {
  const availableGates = useCurrentProject()!.availableGates;
  const dispatch = useAppDispatch();
  const initialFormValues: { name: string; tableIdx: string } = {
    name: "",
    tableIdx: `0`,
  };
  const gates = useAppSelector((state) => state.board.logicGates);
  return (
    <Formik
      initialValues={initialFormValues}
      onSubmit={(values) => {
        const idx = parseInt(values.tableIdx);
        for (let i = 0; i < gates.length; i++) {
          if (gates[i][1] === values.name) {
            alert("Gate with that name already exists!");
            return;
          }
        }
        dispatch(
          BoardSliceActions.addLogicGate([availableGates[idx], values.name])
        );
        dialog.handleClose();
      }}
    >
      {({ values, handleChange, submitForm }) => (
        <AppModal {...dialog} heading="Add Gate" onSubmit={submitForm}>
          <Form className="flex flex-col">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
            />
            <label htmlFor="table">Table</label>
            <select
              name="tableIdx"
              value={values.tableIdx}
              onChange={handleChange}
              className="w-full bg-amber-700 text-black"
            >
              {availableGates.map((table, i) => (
                <option key={table.name} value={`${i}`}>
                  {table.name}
                </option>
              ))}
            </select>
          </Form>
        </AppModal>
      )}
    </Formik>
  );
};

interface WorkAreaGatesProps {}
export const WorkAreaGates: React.FC<WorkAreaGatesProps> = () => {
  const gates = useAppSelector((state) => state.board.logicGates);
  const dispatch = useAppDispatch();

  return (
    <>
      <WorkAreaSection
        title="Gates"
        iterable={gates}
        Modal={AddGateModal}
        deletePrompt={(idx) =>
          `Delete gate ${gates[idx][1]} and all it's connections?`
        }
        deleteItem={(idx) => {
          dispatch(BoardSliceActions.deleteLogicGate(idx));
          return true;
        }}
        renderHeading={() => (
          <>
            <th>Name</th>
            <th>Type</th>
          </>
        )}
        renderItem={(item) => (
          <>
            <td>{item[1]}</td>
            <td>{item[0].name}</td>
          </>
        )}
      />
    </>
  );
};
