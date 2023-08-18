import React from "react";
import { Divider } from "./Divider";

interface HeadingWithPlusMinusProps {
  title: string;
  onPlusClick: () => void;
  onMinusClick: () => void;
  plusDisabled?: boolean;
  minusDisabled?: boolean;
}
export const HeadingWithPM: React.FC<HeadingWithPlusMinusProps> = ({
  title,
  onPlusClick,
  onMinusClick,
  plusDisabled = false,
  minusDisabled = false,
}) => {
  return (
    <>
      <div className="flex justify-between px-2">
        <span>{title}</span>
        <div>
          <button onClick={onMinusClick} disabled={minusDisabled}>
            -
          </button>
          <button onClick={onPlusClick} disabled={plusDisabled}>
            +
          </button>
        </div>
      </div>
      <Divider type="horizontal" />
    </>
  );
};
