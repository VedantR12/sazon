import { create } from "zustand";
import maplibregl from "maplibre-gl";

type MapInstanceState = {
    map: maplibregl.Map | null;

    setMap: (map: maplibregl.Map) => void;
};

export const useMapInstanceStore =
    create<MapInstanceState>((set) => ({
        map: null,

        setMap: (map) => set({ map }),
    }));