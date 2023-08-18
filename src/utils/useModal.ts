import React from "react";

export type UseModalArgs = {
  isOpen: boolean;
  handleClose: () => void;
};

type useModalType = (dialog: (options: UseModalArgs) => JSX.Element) => {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  dialog: React.ReactNode;
};

export const useModal: useModalType = (dialog) => {
  const [isOpen, setOpen] = React.useState(false);

  const handleClose = () => setOpen(false);

  return {
    isOpen: isOpen,
    setOpen,
    dialog: isOpen ? dialog({ isOpen, handleClose }) : null,
  };
};
