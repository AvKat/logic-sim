import React from "react";

interface DividerProps {
  type: "horizontal" | "vertical";
}
export const Divider: React.FC<DividerProps> = ({ type }) => {
  return (
    <div>
      {type === "horizontal" ? (
        <div
          style={{
            width: "100%",
            height: "2px",
            backgroundColor: "white",
          }}
        />
      ) : (
        <div
          style={{
            width: "2px",
            height: "100%",
            backgroundColor: "white",
          }}
        />
      )}
    </div>
  );
};
