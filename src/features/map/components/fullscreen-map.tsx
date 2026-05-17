"use client";

import { useEffect, useRef } from "react";
import maplibregl, { type StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useVendorStore } from "@/features/vendors/store/vendor-store";
import { useMapStore } from "../store/map-store";
import { useMapInstanceStore } from "../store/map-instance-store";

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
                "background-color": "#111111",
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
    const containerRef = useRef<HTMLDivElement | null>(null);

    const mapRef = useRef<maplibregl.Map | null>(null);

    const { setCenter, setZoom, setBounds } = useMapStore();

    const setMap =
        useMapInstanceStore((state) => state.setMap);

    const vendors = useVendorStore((state) => state.vendors);

    useEffect(() => {
        if (!containerRef.current) return;

        mapRef.current = new maplibregl.Map({
            container: containerRef.current,
            style: mapStyle,
            center: [73.7898, 19.9975],
            zoom: 12,
        });

        const map = mapRef.current;

        if (!map) return;

        setMap(map);

        map.on("load", () => {
            console.log("MAP LOADED");
        });

        map.on("moveend", () => {
            const center = map.getCenter();
            const bounds = map.getBounds();

            setCenter([center.lng, center.lat]);

            setZoom(map.getZoom());

            setBounds({
                north: bounds.getNorth(),
                south: bounds.getSouth(),
                east: bounds.getEast(),
                west: bounds.getWest(),
            });
        });

        return () => {
            mapRef.current?.remove();
        };
    }, [setCenter, setZoom, setBounds]);

    useEffect(() => {
        const map = mapRef.current;

        if (!map) return;

        const addVendorLayer = () => {
            const geojson = {
                type: "FeatureCollection",

                features: vendors.map((vendor) => ({
                    type: "Feature",

                    geometry: {
                        type: "Point",
                        coordinates: [vendor.longitude, vendor.latitude],
                    },

                    properties: {
                        id: vendor.id,
                        name: vendor.name,
                    },
                })),
            };

            if (map.getSource("vendors")) {
                (
                    map.getSource("vendors") as maplibregl.GeoJSONSource
                ).setData(
                    geojson as GeoJSON.FeatureCollection
                );

                return;
            }

            map.addSource("vendors", {
                type: "geojson",

                data: geojson as GeoJSON.FeatureCollection,

                cluster: true,

                clusterMaxZoom: 14,

                clusterRadius: 50,
            });

            map.addLayer({
                id: "clusters",

                type: "circle",

                source: "vendors",

                filter: ["has", "point_count"],

                paint: {
                    "circle-color": "#ff5500",

                    "circle-radius": [
                        "step",
                        ["get", "point_count"],
                        20,
                        10,
                        26,
                        30,
                        34,
                    ],

                    "circle-stroke-width": 2,

                    "circle-stroke-color": "#ffffff",
                },
            });

            map.addLayer({
                id: "cluster-count",

                type: "symbol",

                source: "vendors",

                filter: ["has", "point_count"],

                layout: {
                    "text-field": ["get", "point_count_abbreviated"],

                    "text-size": 14,
                },

                paint: {
                    "text-color": "#ffffff",
                },
            });



            map.on("click", "clusters", async (e) => {
                const features = map.queryRenderedFeatures(e.point, {
                    layers: ["clusters"],
                });

                if (!features.length) return;

                const feature = features[0];

                const clusterId = feature.properties?.cluster_id;

                if (typeof clusterId !== "number") return;

                const source = map.getSource(
                    "vendors"
                ) as maplibregl.GeoJSONSource;

                const coordinates = (
                    feature.geometry as unknown as GeoJSON.Point
                ).coordinates;

                map.flyTo({
                    center: coordinates as [number, number],

                    zoom: Math.min(map.getZoom() + 1.5, 16),

                    speed: 0.8,

                    curve: 1.4,

                    essential: true,
                });
            });

            map.on("mouseenter", "clusters", () => {
                map.getCanvas().style.cursor = "pointer";
            });

            map.on("mouseleave", "clusters", () => {
                map.getCanvas().style.cursor = "";
            });
        };

        if (map.isStyleLoaded()) {
            addVendorLayer();
        } else {
            map.on("load", addVendorLayer);
        }

        return () => {
    map.off("load", addVendorLayer);
};
    }, [vendors]);

    return (
        <div
            ref={containerRef}
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
            }}
        />
    );
}