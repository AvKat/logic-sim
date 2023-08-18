import React from "react";
import { useAppSelector } from "../../utils/redux/store";
import { Divider } from "../Divider";
import { WorkAreaConnections } from "./WorkAreaConnections";
import { WorkAreaGates } from "./WorkAreaGates";

interface WorkAreaProps {}

export const WorkArea: React.FC<WorkAreaProps> = () => {
  const isBoardOpen = useAppSelector((state) => state.project.boardOpen);

  return (
    <>
      <div className="flex-1 h-full m-0 flex">
        {isBoardOpen ? (
          <>
            <WorkAreaGates />
            <Divider type="vertical" />
            <WorkAreaConnections />
          </>
        ) : (
          <div className="flex-1 h-full m-0 flex justify-center items-center">
            <h1 className="text-4xl font-bold">No board open</h1>
          </div>
        )}
      </div>
    </>
  );
};
