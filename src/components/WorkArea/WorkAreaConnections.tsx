import { Form, Formik } from "formik";
import React from "react";
import { BoardSliceActions } from "../../utils/redux/boardSlice";
import { useAppDispatch, useAppSelector } from "../../utils/redux/store";
import { UseModalArgs } from "../../utils/useModal";
import { AppModal } from "../AppModal";
import { WorkAreaSection } from "./WorkAreaSection";

const AddConnectionModal: React.FC<UseModalArgs> = (dialog) => {
  const gates = useAppSelector((state) => state.board.logicGates);
  const dispatch = useAppDispatch();
  const initialFormValues: {
    fromGateIdx: number;
    fromPin: number;
    toGateIdx: number;
    toPin: number;
  } = { fromGateIdx: 0, fromPin: 0, toGateIdx: 0, toPin: 0 };

  return (
    <Formik
      initialValues={initialFormValues}
      onSubmit={({ fromGateIdx, fromPin, toGateIdx, toPin }) => {
        const fromGate = gates[fromGateIdx][1];
        const toGate = gates[toGateIdx][1];
        dispatch(
          BoardSliceActions.addConnection([fromGate, fromPin, toGate, toPin])
        );
        dialog.handleClose();
      }}
    >
      {({ values, handleChange, submitForm }) => (
        <AppModal {...dialog} heading="Add Connection" onSubmit={submitForm}>
          <Form className="flex flex-col">
            <span className="text-lg mt-3 font-semibold">From</span>
            <div className="flex justify-between my-2 text-lg">
              <select
                name="fromGateIdx"
                value={values.fromGateIdx}
                onChange={handleChange}
                className="w-full bg-amber-700 text-black"
              >
                {gates.map((table, i) => (
                  <option key={`from-${table[0].name}-${i}`} value={`${i}`}>
                    {table[1]}
                  </option>
                ))}
              </select>
              <select
                name="fromPin"
                value={values.fromPin}
                onChange={handleChange}
                className="w-20 text-center ml-5 rounded"
              >
                {[...Array(gates[values.fromGateIdx][0].numOutputs).keys()].map(
                  (_, i) => (
                    <option
                      key={`from${values.fromGateIdx}-${i}`}
                      value={`${i}`}
                    >
                      {i}
                    </option>
                  )
                )}
              </select>
            </div>
            <span className="text-lg mt-3 font-semibold">To</span>
            <div className="flex justify-between my-2 text-lg">
              <select
                name="toGateIdx"
                value={values.toGateIdx}
                onChange={(e) => {
                  handleChange(e);
                }}
                className="w-full bg-amber-700 text-black"
              >
                {gates.map((table, i) => (
                  <option key={`to-${table[0].name}-${i}`} value={`${i}`}>
                    {table[1]}
                  </option>
                ))}
              </select>
              <select
                name="toPin"
                value={values.toPin}
                onChange={handleChange}
                className="w-20 text-center ml-5 rounded"
              >
                {[...Array(gates[values.toGateIdx][0].numInputs).keys()].map(
                  (i) => (
                    <option key={`to${values.toGateIdx}-${i}`} value={`${i}`}>
                      {i}
                    </option>
                  )
                )}
              </select>
            </div>
          </Form>
        </AppModal>
      )}
    </Formik>
  );
};

export const WorkAreaConnections: React.FC = () => {
  const gates = useAppSelector((state) => state.board.logicGates);
  const connections = useAppSelector((state) => state.board.connections);
  const dispatch = useAppDispatch();

  return (
    <>
      <WorkAreaSection
        title="Connections"
        iterable={connections}
        Modal={AddConnectionModal}
        deletePrompt={() => `Delete the selected connection??`}
        deleteItem={(idx) => {
          dispatch(BoardSliceActions.deleteConnection(idx));
          return true;
        }}
        renderHeading={() => (
          <>
            <th>From</th>
            <th>From Pin</th>
            <th>To</th>
            <th>To Pin</th>
          </>
        )}
        renderItem={(item) => (
          <>
            <td>{item[0]}</td>
            <td>{item[1]}</td>
            <td>{item[2]}</td>
            <td>{item[3]}</td>
          </>
        )}
        plusDisabled={!gates.length}
      />
    </>
  );
};
