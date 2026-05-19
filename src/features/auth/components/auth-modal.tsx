"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

import { useAuthModalStore } from "../store/auth-modal-store";

export default function AuthModal() {
    
const supabase = createClient();
    const {
        isOpen,
        mode,
        close,
        openLogin,
        openSignup,
    } = useAuthModalStore();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    if (!isOpen) return null;

    const handleAuth = async () => {
        setLoading(true);

        setError("");

        let result;

        if (mode === "signup") {
            result =
                await supabase.auth.signUp({
                    email,
                    password,
                });

            if (result.error) {
                if (
                    result.error.message.includes(
                        "already registered"
                    )
                ) {
                    setError(
                        "Account already exists. Please login instead."
                    );
                } else {
                    setError(
                        result.error.message
                    );
                }

                setLoading(false);

                return;
            }
        } else {
            result =
                await supabase.auth.signInWithPassword(
                    {
                        email,
                        password,
                    }
                );

            if (result.error) {
                setError(
                    "Invalid email or password."
                );

                setLoading(false);

                return;
            }
        }

        setLoading(false);

        close();
    };

    return (
        <div
            onClick={close}
            style={{
                position: "fixed",

                inset: 0,

                background:
                    "rgba(0,0,0,0.25)",

                backdropFilter:
                    "blur(12px)",

                zIndex: 300,

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

                    maxWidth: 420,

                    background: "white",

                    borderRadius: 32,

                    padding: 24,

                    boxShadow:
                        "0 20px 60px rgba(0,0,0,0.25)",
                }}
            >
                <div
                    style={{
                        fontSize: 30,

                        fontWeight: 800,
                    }}
                >
                    {mode === "signup"
                        ? "Create Account"
                        : "Welcome Back"}
                </div>

                <div
                    style={{
                        marginTop: 8,

                        opacity: 0.6,
                    }}
                >
                    Continue your food journey.
                </div>

                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(
                            e.target.value
                        )
                    }
                    style={{
                        width: "100%",

                        marginTop: 24,

                        padding: 16,

                        borderRadius: 16,

                        border:
                            "1px solid rgba(0,0,0,0.08)",

                        outline: "none",

                        fontSize: 15,
                    }}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(
                            e.target.value
                        )
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

                {error && (
                    <div
                        style={{
                            marginTop: 14,

                            color: "#d11a2a",

                            fontWeight: 600,

                            fontSize: 14,
                        }}
                    >
                        {error}
                    </div>
                )}

                <button
                    onClick={handleAuth}
                    disabled={loading}
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
                    {loading
                        ? "Please wait..."
                        : mode === "signup"
                            ? "Create Account"
                            : "Login"}
                </button>

                <div
                    style={{
                        marginTop: 18,

                        textAlign: "center",

                        fontSize: 14,

                        opacity: 0.7,
                    }}
                >
                    {mode === "signup"
                        ? "Already have an account?"
                        : "New here?"}{" "}
                    <span
                        onClick={() => {
                            setError("");

                            mode ===
                                "signup"
                                ? openLogin()
                                : openSignup();
                        }}
                        style={{
                            fontWeight: 700,

                            cursor: "pointer",
                        }}
                    >
                        {mode === "signup"
                            ? "Login"
                            : "Create account"}
                    </span>
                </div>
            </div>
        </div>
    );
}