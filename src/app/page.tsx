"use client";

import FullscreenMap from "@/features/map/components/fullscreen-map";
import { useMapStore } from "@/features/map/store/map-store";
import { useVendorsInViewport } from "@/features/vendors/hooks/use-vendors-in-viewport";
import { useVendorStore } from "@/features/vendors/store/vendor-store";

export default function Home() {
  useVendorsInViewport();

  const { zoom, center, bounds } = useMapStore();

  const vendors = useVendorStore((state) => state.vendors);

  return (
    <main
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <FullscreenMap />

      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 10,
          background: "black",
          color: "white",
          padding: 12,
          borderRadius: 8,
        }}
      >
        <p>Zoom: {zoom.toFixed(2)}</p>

        <p>
          Center: {center[0].toFixed(4)}, {center[1].toFixed(4)}
        </p>

        <p>{bounds ? "Tracking Active" : "Loading"}</p>

        <p>Vendors Loaded: {vendors.length}</p>
      </div>
    </main>
  );
}