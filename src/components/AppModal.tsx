import React from "react";
import ReactModal from "react-modal";

interface AppModalProps {
  heading: string;
  isOpen: boolean;
  handleClose: () => void;
  children?: React.ReactNode;
  onSubmit?: () => void;
}
export const AppModal: React.FC<AppModalProps> = ({
  isOpen,
  handleClose: onClose,
  children,
  heading,
  onSubmit,
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      className="Modal"
      overlayClassName="Overlay"
      onRequestClose={onClose}
    >
      <div
        style={{
          flex: 1,
        }}
      >
        <h2>{heading}</h2>
        {children}
      </div>
      <div style={{ display: "flex" }}>
        <button
          onClick={onClose}
          style={{
            marginLeft: "auto",
            marginRight: "20px",
          }}
        >
          Cancel
        </button>
        {onSubmit && <button onClick={onSubmit}>Save</button>}
      </div>
    </ReactModal>
  );
};
