import { create } from "zustand";
import { Vendor } from "../types/vendor";

type VendorState = {
  vendors: Vendor[];

  setVendors: (vendors: Vendor[]) => void;
};

export const useVendorStore = create<VendorState>((set) => ({
  vendors: [],

  setVendors: (vendors) => set({ vendors }),
}));