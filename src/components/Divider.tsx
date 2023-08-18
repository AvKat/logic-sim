import React from "react";

interface DividerProps {
  type: "horizontal" | "vertical";
}
export const Divider: React.FC<DividerProps> = ({ type }) => {
  return type === "horizontal" ? (
    <div className="w-full h-0.5 bg-white" />
  ) : (
    <div className="h-full w-0.5 bg-white" />
  );
};
