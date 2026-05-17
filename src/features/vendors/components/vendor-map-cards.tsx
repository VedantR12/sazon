"use client";

import { useEffect } from "react";

import maplibregl from "maplibre-gl";

import { useVendorStore } from "../store/vendor-store";

import { useSelectedVendorStore } from "../store/selected-vendor-store";

import { useMapInstanceStore } from "@/features/map/store/map-instance-store";

export default function VendorMapCards() {
    const vendors = useVendorStore(
        (state) => state.vendors
    );

    const map = useMapInstanceStore(
        (state) => state.map
    );

    const setSelectedVendor =
        useSelectedVendorStore(
            (state) => state.setSelectedVendor
        );

    useEffect(() => {
        if (!map) return;

        const markers: maplibregl.Marker[] = [];

        const visibleVendors =
    map.getZoom() < 13
        ? []
        : [...vendors]
              .sort(
                  (a, b) =>
                      (b.rating || 0) -
                      (a.rating || 0)
              )
              .slice(0, 12);

        visibleVendors.forEach((vendor) => {
            const el = document.createElement("div");

            el.style.background =
                "rgba(255,255,255,0.96)";

            el.style.borderRadius = "999px";

            el.style.padding = "6px 10px";

            el.style.maxWidth = "140px";

            el.style.boxShadow =
                "0 2px 10px rgba(0,0,0,0.18)";

            el.style.border =
                "1px solid rgba(0,0,0,0.06)";

            el.style.cursor = "pointer";

            el.style.pointerEvents = "auto";

            el.style.backdropFilter =
                "blur(10px)";

            el.style.whiteSpace = "nowrap";

            el.style.overflow = "hidden";

            el.style.textOverflow = "ellipsis";

            el.style.userSelect = "none";

            el.innerHTML = `
                <div style="
                    font-weight:600;
                    font-size:11px;
                ">
                    🔥 ${
                        vendor.best_item ||
                        vendor.name
                    }
                </div>

                <div style="
                    margin-top:4px;
                    font-size:10px;
                    opacity:0.7;
                ">
                    ⭐ ${
                        vendor.rating || 4.5
                    } · ${
                vendor.price_range || "₹100"
            }
                </div>
            `;

            el.onclick = () => {
    setSelectedVendor(vendor);
};

            const marker = new maplibregl.Marker({
                element: el,
                anchor: "center",
            })
                .setLngLat([
                    vendor.longitude,
                    vendor.latitude,
                ])
                .addTo(map);

            markers.push(marker);
        });

        return () => {
            markers.forEach((marker) =>
                marker.remove()
            );
        };
    }, [map, vendors, setSelectedVendor]);

    return null;
}