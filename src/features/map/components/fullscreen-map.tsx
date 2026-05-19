"use client";

import { useEffect, useRef } from "react";

import maplibregl, {
    type StyleSpecification,
} from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";

import { useVendorStore } from "@/features/vendors/store/vendor-store";

import { useMapStore } from "../store/map-store";

import { useMapInstanceStore } from "../store/map-instance-store";

import { useLocationPickerStore } from "@/features/vendors/store/location-picker-store";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { createClient } from "@/lib/supabase/client";

const mapStyle: StyleSpecification = {
    version: 8,

    sources: {
        osm: {
            type: "raster",

            tiles: [
                "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
            ],

            tileSize: 256,
        },
    },

    layers: [
        {
            id: "background",

            type: "background",

            paint: {
                "background-color":
                    "#111111",
            },
        },

        {
            id: "osm",

            type: "raster",

            source: "osm",
        },
    ],
};

export default function FullscreenMap() {

    const supabase = createClient();
    const containerRef =
        useRef<HTMLDivElement | null>(
            null
        );

    const mapRef =
        useRef<maplibregl.Map | null>(
            null
        );

    const tempMarkerRef =
        useRef<maplibregl.Marker | null>(
            null
        );

    const {
        setCenter,
        setZoom,
        setBounds,
    } = useMapStore();

    const setMap =
        useMapInstanceStore(
            (state) => state.setMap
        );

    const vendors = useVendorStore(
        (state) => state.vendors
    );

    const user = useAuthStore(
        (state) => state.user
    );

    const {
        isPicking,
        pendingVendor,
        stopPicking,
    } = useLocationPickerStore();

    useEffect(() => {
        if (!containerRef.current)
            return;

        mapRef.current =
            new maplibregl.Map({
                container:
                    containerRef.current,

                style: mapStyle,

                center: [
                    73.7898,
                    19.9975,
                ],

                zoom: 12,
            });

        const map = mapRef.current;

        if (!map) return;

        setMap(map);

        map.on("load", () => {
            console.log(
                "MAP LOADED"
            );
        });

        map.on("moveend", () => {
            const center =
                map.getCenter();

            const bounds =
                map.getBounds();

            setCenter([
                center.lng,
                center.lat,
            ]);

            setZoom(map.getZoom());

            setBounds({
                north:
                    bounds.getNorth(),

                south:
                    bounds.getSouth(),

                east: bounds.getEast(),

                west: bounds.getWest(),
            });
        });

        return () => {
            map.remove();
        };
    }, [
        setCenter,
        setZoom,
        setBounds,
        setMap,
    ]);

    useEffect(() => {
        const map = mapRef.current;

        if (!map) return;

        const handleMapClick = (
            e: maplibregl.MapMouseEvent
        ) => {
            if (
                !isPicking ||
                !pendingVendor
            )
                return;

            const latitude =
                e.lngLat.lat;

            const longitude =
                e.lngLat.lng;

            tempMarkerRef.current?.remove();

            tempMarkerRef.current =
                new maplibregl.Marker({
                    color: "#111",
                })
                    .setLngLat([
                        longitude,
                        latitude,
                    ])
                    .addTo(map);

            setTimeout(() => {
                const confirmed =
                    window.confirm(
                        "Confirm this vendor location?"
                    );

                if (!confirmed) {
                    tempMarkerRef.current?.remove();

                    tempMarkerRef.current =
                        null;

                    return;
                }

                stopPicking();

                const submitVendor =
                    async () => {

                        // GET USER ROLE

                        const {
                            data: profile,
                            error: profileError,
                        } = await supabase
                            .from("profiles")
                            .select("role")
                            .eq("id", user?.id)
                            .single();

                        if (profileError) {
                            console.error(profileError);

                            alert(
                                "Failed to verify user role"
                            );

                            return;
                        }

                        // ADMIN FLOW

                        if (profile?.role === "admin") {

                            const { error } =
                                await supabase
                                    .from("vendors")
                                    .insert({
                                        name:
                                            pendingVendor.name,

                                        best_item:
                                            pendingVendor.bestItem,

                                        address:
                                            pendingVendor.address,

                                        phone:
                                            pendingVendor.phone,

                                        image_url:
                                            pendingVendor.image_url,

                                        latitude,

                                        longitude,
                                    });

                            if (error) {
                                console.error(error);

                                alert(
                                    "Failed to add vendor"
                                );

                                return;
                            }

                            alert(
                                "Vendor added successfully"
                            );

                            return;
                        }

                        // NORMAL USER FLOW

                        const { error } =
                            await supabase
                                .from(
                                    "vendor_submissions"
                                )
                                .insert({
                                    submitted_by:
                                        user?.id,

                                    status:
                                        "pending",

                                    name:
                                        pendingVendor.name,

                                    best_item:
                                        pendingVendor.bestItem,

                                    address:
                                        pendingVendor.address,

                                    phone:
                                        pendingVendor.phone,

                                    image_url:
                                        pendingVendor.image_url,

                                    latitude,

                                    longitude,
                                });

                        if (error) {
                            console.error(error);

                            alert(
                                "Failed to submit request"
                            );

                            return;
                        }

                        alert(
                            "Request sent for review"
                        );
                    };

                submitVendor();
            }, 100);
        };

        map.on(
            "click",
            handleMapClick
        );

        return () => {
            map.off(
                "click",
                handleMapClick
            );
        };
    }, [
        isPicking,

        pendingVendor,

        stopPicking,
    ]);

    useEffect(() => {
        const map = mapRef.current;

        if (!map) return;

        const addVendorLayer = () => {
            const geojson = {
                type: "FeatureCollection",

                features: vendors.map(
                    (vendor) => ({
                        type: "Feature",

                        geometry: {
                            type: "Point",

                            coordinates: [
                                vendor.longitude,
                                vendor.latitude,
                            ],
                        },

                        properties: {
                            id: vendor.id,

                            name: vendor.name,
                        },
                    })
                ),
            };

            if (
                map.getSource("vendors")
            ) {
                (
                    map.getSource(
                        "vendors"
                    ) as maplibregl.GeoJSONSource
                ).setData(
                    geojson as any
                );

                return;
            }

            map.addSource(
                "vendors",
                {
                    type: "geojson",

                    data: geojson as any,

                    cluster: true,

                    clusterRadius: 60,
                }
            );

            map.addLayer({
                id: "clusters",

                type: "circle",

                source: "vendors",

                filter: [
                    "has",
                    "point_count",
                ],

                paint: {
                    "circle-color":
                        "#111",

                    "circle-radius": 22,
                },
            });

            map.addLayer({
                id: "cluster-count",

                type: "symbol",

                source: "vendors",

                filter: [
                    "has",
                    "point_count",
                ],

                layout: {
                    "text-field":
                        "{point_count_abbreviated}",

                    "text-size": 12,
                },

                paint: {
                    "text-color":
                        "#fff",
                },
            });
        };

        if (map.loaded()) {
            addVendorLayer();
        } else {
            map.on(
                "load",
                addVendorLayer
            );
        }

        return () => {
            if (
                map.getLayer(
                    "clusters"
                )
            ) {
                map.removeLayer(
                    "clusters"
                );
            }

            if (
                map.getLayer(
                    "cluster-count"
                )
            ) {
                map.removeLayer(
                    "cluster-count"
                );
            }

            if (
                map.getSource(
                    "vendors"
                )
            ) {
                map.removeSource(
                    "vendors"
                );
            }
        };
    }, [vendors]);

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "100%",
            }}
        />
    );
}