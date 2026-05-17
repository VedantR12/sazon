import { create } from "zustand";

type Bounds = {
  north: number;
  south: number;
  east: number;
  west: number;
};

type MapState = {
  center: [number, number];
  zoom: number;
  bounds: Bounds | null;

  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  setBounds: (bounds: Bounds) => void;
};

export const useMapStore = create<MapState>((set) => ({
  center: [73.7898, 19.9975],
  zoom: 12,
  bounds: null,

  setCenter: (center) => set({ center }),

  setZoom: (zoom) => set({ zoom }),

  setBounds: (bounds) => set({ bounds }),
}));