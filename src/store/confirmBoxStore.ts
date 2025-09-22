// confirmBoxStore.ts
import { create } from "zustand";

type ConfirmBoxState = {
  isOpen: boolean;
  title?: string;
  message?: React.ReactNode;
  functionTwoText?: string;
  functionOneText?: string;
  destructive?: boolean;
  disableBackdropClick?: boolean;
  functionOne?: () => void;
  functionTwo?: () => void;
  onClose?: () => void;
  open: (options: Omit<ConfirmBoxState, "isOpen" | "open" | "close">) => void;
  close: () => void;
};

export const useConfirmBoxStore = create<ConfirmBoxState>((set) => ({
  isOpen: false,
  title: "Actions",
  message: "",
  functionTwoText: "Detail",
  functionOneText: "Delete",
  destructive: false,
  disableBackdropClick: false,
  functionOne: undefined,
  functionTwo: undefined,
  onClose: undefined,

  open: (options) =>
    set({
      ...options,
      isOpen: true,
    }),

  close: () =>
    set((state) => {
      state.onClose?.(); // optional callback
      return {
        isOpen: false,
      };
    }),
}));
