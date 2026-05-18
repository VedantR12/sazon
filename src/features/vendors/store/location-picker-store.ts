import { create } from "zustand";

type LocationPickerState = {
    isPicking: boolean;

    pendingVendor: any;

    startPicking: (
        vendorData: any
    ) => void;

    stopPicking: () => void;
};

export const useLocationPickerStore =
    create<LocationPickerState>(
        (set) => ({
            isPicking: false,

            pendingVendor: null,

            startPicking: (
                vendorData
            ) =>
                set({
                    isPicking: true,

                    pendingVendor:
                        vendorData,
                }),

            stopPicking: () =>
                set({
                    isPicking: false,

                    pendingVendor:
                        null,
                }),
        })
    );