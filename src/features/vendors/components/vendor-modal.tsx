"use client";

import { useSelectedVendorStore } from "../store/selected-vendor-store";

export default function VendorModal() {
    const {
        selectedVendor,
        setSelectedVendor,
    } = useSelectedVendorStore();

    if (!selectedVendor) return null;

    return (
        <div
            onClick={() =>
                setSelectedVendor(null)
            }
            style={{
                position: "fixed",
                inset: 0,
                background:
                    "rgba(0,0,0,0.28)",

                backdropFilter: "blur(12px)",

                WebkitBackdropFilter:
                    "blur(12px)",
                zIndex: 100,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div
                onClick={(e) =>
                    e.stopPropagation()
                }
                style={{
                    width: "100%",
                    maxWidth: 500,
                    height: "80vh",
                    boxShadow:
                        "0 25px 80px rgba(0,0,0,0.35)",
                    paddingBottom: 24,
                    background: "#fcfcfc",
                    borderRadius: 32,
                    overflow: "hidden",
                    overflowY: "auto",
                }}
            >


                <div
                    style={{
                        height: 320,
                        background: "#f3f3f3",

                        position: "relative",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",

                            top: 14,

                            left: "50%",

                            transform: "translateX(-50%)",

                            width: 50,

                            height: 5,

                            background:
                                "rgba(255,255,255,0.7)",

                            borderRadius: 999,

                            zIndex: 2,
                        }}
                    />
                    {selectedVendor.image_url ? (
                        <>
                            <img
                                src={
                                    selectedVendor.image_url
                                }
                                alt={
                                    selectedVendor.name
                                }
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />

                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    background:
                                        "linear-gradient(to top, rgba(0,0,0,0.28), transparent)",
                                }}
                            />
                        </>
                    ) : null}
                </div>

                <div
                    style={{
                        padding: 20,
                    }}
                >
                    <div
                        style={{
                            fontSize: 30,
                            fontWeight: 800,
                        }}
                    >
                        🔥{" "}
                        {
                            selectedVendor.best_item
                        }
                    </div>

                    <div
                        style={{
                            marginTop: 8,
                            opacity: 0.7,
                        }}
                    >
                        {selectedVendor.name}
                    </div>

                    <div
                        style={{
                            marginTop: 18,
                        }}
                    >
                        ⭐{" "}
                        {selectedVendor.rating}
                        {" · "}
                        {
                            selectedVendor.price_range
                        }
                    </div>

                    <div
                        style={{
                            marginTop: 24,
                            lineHeight: 1.7,
                        }}
                    >
                        📍{" "}
                        {selectedVendor.address}
                    </div>

                    <div
                        style={{
                            marginTop: 12,
                            lineHeight: 1.7,
                        }}
                    >
                        📞{" "}
                        {selectedVendor.phone}
                    </div>
                </div>
            </div>
        </div>
    );
}