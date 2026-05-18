"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAddVendorStore } from "../store/add-vendor-store";
import { useLocationPickerStore } from "../store/location-picker-store";

export default function AddVendorModal() {
    const { isOpen, close } =
        useAddVendorStore();

    const startPicking =
        useLocationPickerStore(
            (state) => state.startPicking
        );

    const [name, setName] =
        useState("");

    const [bestItem, setBestItem] =
        useState("");

    const [address, setAddress] =
        useState("");

    const [phone, setPhone] =
        useState("");

    const [imageFile, setImageFile] =
        useState<File | null>(null);

    const handleSubmit = async () => {
        let uploadedImageUrl = "";

        if (imageFile) {
            const fileName = `${Date.now()}-${imageFile.name}`;

            const { error } =
                await supabase.storage
                    .from("vendor-images")
                    .upload(
                        fileName,
                        imageFile
                    );

            if (!error) {
                uploadedImageUrl =
                    supabase.storage
                        .from(
                            "vendor-images"
                        )
                        .getPublicUrl(
                            fileName
                        ).data.publicUrl;
            }
        }

        startPicking({
            name,
            bestItem,
            address,
            phone,

            image_url:
                uploadedImageUrl,
        });

        close();
    };

    if (!isOpen) return null;

    return (
        <div
            onClick={close}
            style={{
                position: "fixed",

                inset: 0,

                background:
                    "rgba(0,0,0,0.28)",

                backdropFilter:
                    "blur(12px)",

                zIndex: 400,

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
                    width: "92%",

                    maxWidth: 500,

                    background: "white",

                    borderRadius: 32,

                    padding: 24,

                    boxShadow:
                        "0 25px 80px rgba(0,0,0,0.35)",
                }}
            >
                <div
                    style={{
                        fontSize: 30,

                        fontWeight: 800,
                    }}
                >
                    Add New Spot
                </div>

                <div
                    style={{
                        marginTop: 8,

                        opacity: 0.6,
                    }}
                >
                    Share your hidden gem.
                </div>

                {[
                    {
                        value: name,
                        setter: setName,
                        placeholder:
                            "Vendor Name",
                    },

                    {
                        value: bestItem,
                        setter: setBestItem,
                        placeholder:
                            "Best Dish",
                    },

                    {
                        value: address,
                        setter: setAddress,
                        placeholder:
                            "Address",
                    },

                    {
                        value: phone,
                        setter: setPhone,
                        placeholder:
                            "Phone Number",
                    },


                ].map((field) => (
                    <input
                        key={field.placeholder}
                        value={field.value}
                        onChange={(e) =>
                            field.setter(
                                e.target.value
                            )
                        }
                        placeholder={
                            field.placeholder
                        }
                        style={{
                            width: "100%",

                            marginTop: 14,

                            padding: 16,

                            borderRadius: 16,

                            border:
                                "1px solid rgba(0,0,0,0.08)",

                            outline: "none",

                            fontSize: 15,
                        }}
                    />
                ))}

                <div
                    style={{
                        marginTop: 16,
                    }}
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file =
                                e.target.files?.[0];

                            if (file) {
                                setImageFile(file);
                            }
                        }}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    style={{
                        width: "100%",

                        marginTop: 20,

                        padding: 16,

                        border: "none",

                        borderRadius: 18,

                        background: "#111",

                        color: "white",

                        fontWeight: 700,

                        cursor: "pointer",

                        fontSize: 15,
                    }}
                >
                    Continue to Pin Location
                </button>
            </div>
        </div>
    );
}