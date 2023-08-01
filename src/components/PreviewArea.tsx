import React from "react";

interface PreviewAreaProps {}
export const PreviewArea: React.FC<PreviewAreaProps> = () => {
  return (
    <div
      style={{
        flex: 3,
        height: "100%",
        backgroundColor: "green",
        margin: 0,
      }}
    ></div>
  );
};
