import React from "react";
import { useDialog } from "../utils/useModal";
import { AppModal } from "./AppModal";
import { Divider } from "./Divider";
import { HeadingWithPM } from "./HeadingWithPM";

interface WorkAreaProps {}

export const WorkArea: React.FC<WorkAreaProps> = () => {
  const { dialog, setOpen } = useDialog((dialog) => (
    <AppModal {...dialog} heading="Add Gate" />
  ));

  return (
    <>
      {dialog}
      <div
        style={{
          flex: 2,
          height: "100%",
          margin: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            flex: 1,
            height: "100%",
            margin: 0,
          }}
        >
          <HeadingWithPM
            title="Gates"
            onPlusClick={() => setOpen(true)}
            onMinusClick={() => {}}
          />
        </div>
        <Divider type="horizontal" />

        <div
          style={{
            flex: 2,
            height: "100%",
            margin: 0,
          }}
        >
          <HeadingWithPM
            title="Connections"
            onPlusClick={() => {}}
            onMinusClick={() => {}}
          />
        </div>
      </div>
    </>
  );
};
