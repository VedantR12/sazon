"use client";

import { useEffect } from "react";

import { useMapStore } from "@/features/map/store/map-store";
import { useVendorStore } from "../store/vendor-store";

import { getVendorsInBounds } from "../services/get-vendors-in-bounds";

export function useVendorsInViewport() {
  const bounds = useMapStore((state) => state.bounds);

  const setVendors = useVendorStore((state) => state.setVendors);

  useEffect(() => {
    if (!bounds) return;

    const fetchVendors = async () => {
      const vendors = await getVendorsInBounds(bounds);

      setVendors(vendors);
    };

    fetchVendors();
  }, [bounds, setVendors]);
}