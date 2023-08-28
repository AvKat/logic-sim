import { Form, Formik, useField } from "formik";
import React from "react";
import { arrayRange, capitalize } from "../../utils";
import { BoardSliceActions } from "../../utils/redux/boardSlice";
import { useAppDispatch, useAppSelector } from "../../utils/redux/store";
import { UseModalArgs } from "../../utils/useModal";
import { AppModal } from "../AppModal";
import { WorkAreaSection } from "./WorkAreaSection";

const GateSelect: React.FC<{ selectionType: "from" | "to" }> = ({
  selectionType,
}) => {
  const [gateField] = useField(`${selectionType}GateIdx`);
  const [pinField] = useField(`${selectionType}Pin`);

  const {
    logicGates: gates,
    inputCount,
    outputCount,
  } = useAppSelector((state) => state.board);

  const createOptionArray = (gateIdxString: string) => {
    const gateIdx = parseInt(gateIdxString);
    if (gateIdx === gates.length) {
      return arrayRange(selectionType === "from" ? inputCount : outputCount);
    }
    const gate = gates[gateIdx][0];
    return arrayRange(
      selectionType === "from" ? gate.numOutputs : gate.numInputs
    );
  };

  return (
    <>
      <span className="text-lg mt-3 font-semibold">
        {capitalize(selectionType)}
      </span>
      <div className="flex justify-between my-2 text-lg">
        <select className="w-full bg-amber-700 text-black" {...gateField}>
          <option value={`${gates.length}`}>
            {selectionType === "from" ? "input" : "output"}
          </option>
          {gates.map((table, i) => (
            <option key={`from-${table[0].name}-${i}`} value={`${i}`}>
              {table[1]}
            </option>
          ))}
        </select>
        <select className="w-20 text-center ml-5 rounded" {...pinField}>
          {createOptionArray(gateField.value).map((_, i) => (
            <option key={`from${gateField.value}-${i}`} value={`${i}`}>
              {i}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

const AddConnectionModal: React.FC<UseModalArgs> = (dialog) => {
  const gates = useAppSelector((state) => state.board.logicGates);
  const dispatch = useAppDispatch();
  const initialFormValues: {
    fromGateIdx: string;
    fromPin: string;
    toGateIdx: string;
    toPin: string;
  } = { fromGateIdx: "0", fromPin: "0", toGateIdx: "0", toPin: "0" };

  return (
    <Formik
      initialValues={initialFormValues}
      onSubmit={({ fromGateIdx, fromPin, toGateIdx, toPin }) => {
        const fromGateIdxInt = parseInt(fromGateIdx);
        const toGateIdxInt = parseInt(toGateIdx);
        const fromGate =
          fromGateIdxInt === gates.length ? "input" : gates[fromGateIdxInt][1];
        const toGate =
          toGateIdxInt === gates.length ? "output" : gates[toGateIdxInt][1];
        dispatch(
          BoardSliceActions.addConnection([
            fromGate,
            parseInt(fromPin),
            toGate,
            parseInt(toPin),
          ])
        );
        dialog.handleClose();
      }}
    >
      {({ submitForm }) => (
        <AppModal {...dialog} heading="Add Connection" onSubmit={submitForm}>
          <Form className="flex flex-col">
            <GateSelect selectionType="from" />
            <GateSelect selectionType="to" />
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
