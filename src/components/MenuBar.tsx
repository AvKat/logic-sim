import React from "react";
import { MenuBarHeight } from "../utils/constants";
import { useAppSelector } from "../utils/redux/store";

interface MenuBarProps {}
export const MenuBar: React.FC<MenuBarProps> = () => {
  const currentProject = useAppSelector(
    (state) => state.project.currentProject
  );

  return (
    <div
      style={{
        height: `${MenuBarHeight}px`,
        width: "100vw",
        backgroundColor: "#d55",
        margin: 0,
        display: "flex",
        alignItems: "center",
        color: "black",
        fontWeight: "bold",
        padding: "0 20px",
      }}
    >
      <h3>{currentProject?.name}</h3>
    </div>
  );
};
