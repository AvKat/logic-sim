import React from "react";

type InitFunction = (options: {
  isOpen: boolean;
  handleClose: () => void;
}) => JSX.Element;

type useDialogType = (dialog: InitFunction) => {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  dialog: React.ReactNode;
};

export const useDialog: useDialogType = (dialog) => {
  const [isOpen, setOpen] = React.useState(false);

  const handleClose = () => setOpen(false);

  return {
    isOpen: isOpen,
    setOpen,
    dialog: isOpen ? dialog({ isOpen, handleClose }) : null,
  };
};
