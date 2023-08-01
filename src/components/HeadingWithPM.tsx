import React from "react";
import { Divider } from "./Divider";

interface HeadingWithPlusMinusProps {
  title: string;
  onPlusClick: () => void;
  onMinusClick: () => void;
}
export const HeadingWithPM: React.FC<HeadingWithPlusMinusProps> = ({
  title,
  onPlusClick,
  onMinusClick,
}) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0 10px",
        }}
      >
        <span>{title}</span>
        <div>
          <button onClick={onMinusClick}>-</button>
          <button onClick={onPlusClick}>+</button>
        </div>
      </div>
      <Divider type="horizontal" />
    </>
  );
};
