import React from "react";
import { useModal, UseModalArgs } from "../../utils/useModal";
import { HeadingWithPM } from "../HeadingWithPM";

interface WorkAreaSectionProps<T> {
  title: string;
  Modal: React.FC<UseModalArgs>;
  renderHeading?: () => React.ReactNode;
  iterable: T[];
  renderItem: (item: T, idx: number) => React.ReactNode;
  deleteItem?: (idx: number) => boolean;
  deletePrompt: (idx: number) => string;
  plusDisabled?: boolean;
  minusDisabled?: boolean;
}
export const WorkAreaSection = <T,>({
  Modal,
  renderHeading,
  iterable,
  renderItem,
  deletePrompt,
  title,
  deleteItem,
  minusDisabled = false,
  plusDisabled = false,
}: WorkAreaSectionProps<T>) => {
  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null);

  const { dialog, setOpen } = useModal((dialog) => <Modal {...dialog} />);

  const deleteGate = () => {
    if (selectedIdx !== null) {
      const shouldDelete = window.confirm(deletePrompt(selectedIdx));
      if (!shouldDelete) return;

      if (deleteItem) {
        const isDeleted = deleteItem(selectedIdx);
        if (isDeleted) setSelectedIdx(null);
      }
    }
  };

  return (
    <>
      {dialog}
      <div className="m-0 h-full overflow-y-auto flex-1">
        <HeadingWithPM
          title={title}
          onPlusClick={() => setOpen(true)}
          onMinusClick={deleteGate}
          minusDisabled={selectedIdx === null || minusDisabled}
          plusDisabled={plusDisabled}
        />

        <div onClick={() => setSelectedIdx(null)} className="w-full h-full">
          <table className="work-area-table">
            {renderHeading && (
              <thead>
                <tr>{renderHeading()}</tr>
              </thead>
            )}
            <tbody>
              {iterable.map((item, i) => (
                <tr
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedIdx === i) {
                      setSelectedIdx(null);
                    } else {
                      setSelectedIdx(i);
                    }
                  }}
                  className={
                    "m-1 p-1 text-center " +
                    (selectedIdx === i
                      ? "text-black bg-sky-400"
                      : "text-white bg-transparent")
                  }
                >
                  {renderItem(item, i)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
