import { create } from "zustand";

type AddVendorState = {
    isOpen: boolean;

    open: () => void;

    close: () => void;
};

export const useAddVendorStore =
    create<AddVendorState>((set) => ({
        isOpen: false,

        open: () =>
            set({
                isOpen: true,
            }),

        close: () =>
            set({
                isOpen: false,
            }),
    }));