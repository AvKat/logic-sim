import React from "react";
import ReactModal from "react-modal";

interface AppModalProps {
  heading: string;
  isOpen: boolean;
  handleClose: () => void;
  children?: React.ReactNode;
  onSubmit?: () => void;
  affirmativeText?: string;
  negativeText?: string;
}
export const AppModal: React.FC<AppModalProps> = ({
  isOpen,
  handleClose: onClose,
  children,
  heading,
  onSubmit,
  affirmativeText = "Save",
  negativeText = "Cancel",
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      className="Modal"
      overlayClassName="Overlay"
      onRequestClose={onClose}
    >
      <div className="flex-1">
        <h2 className="text-2xl font-bold">{heading}</h2>
        {children}
      </div>
      <div className="flex">
        <button onClick={onClose} className="ml-auto mr-5">
          {negativeText}
        </button>
        {onSubmit && <button onClick={onSubmit}>{affirmativeText}</button>}
      </div>
    </ReactModal>
  );
};
