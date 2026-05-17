import { create } from "zustand";

import { Vendor } from "../types/vendor";

type SelectedVendorState = {
    selectedVendor: Vendor | null;

    setSelectedVendor: (
        vendor: Vendor | null
    ) => void;
};

export const useSelectedVendorStore =
    create<SelectedVendorState>((set) => ({
        selectedVendor: null,

        setSelectedVendor: (vendor) =>
            set({
                selectedVendor: vendor,
            }),
    }));