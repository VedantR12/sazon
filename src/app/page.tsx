"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/features/auth/store/auth-store";
import FullscreenMap from "@/features/map/components/fullscreen-map";
import { useMapStore } from "@/features/map/store/map-store";
import { useVendorsInViewport } from "@/features/vendors/hooks/use-vendors-in-viewport";
import { useVendorStore } from "@/features/vendors/store/vendor-store";
import VendorMapCards from "@/features/vendors/components/vendor-map-cards";
import VendorModal from "@/features/vendors/components/vendor-modal";
import AuthModal from "@/features/auth/components/auth-modal";
import { useAddVendorStore } from "@/features/vendors/store/add-vendor-store";
import AddVendorModal from "@/features/vendors/components/add-vendor-modal";


import { useAuthModalStore } from "@/features/auth/store/auth-modal-store";

export default function Home() {
  useVendorsInViewport();

  const { zoom, center, bounds } = useMapStore();

  const vendors = useVendorStore((state) => state.vendors);

  const setUser = useAuthStore(
    (state) => state.setUser
  );

  const user = useAuthStore(
    (state) => state.user
  );

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const openSignup =
    useAuthModalStore(
      (state) => state.openSignup
    );

  const openAddVendor =
    useAddVendorStore(
      (state) => state.open
    );

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setSidebarOpen(false);
  };

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setUser(
          data.session?.user || null
        );
      });

    const {
      data: listener,
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(
          session?.user || null
        );
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setUser]);

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

      <VendorMapCards />

      <VendorModal />

      <AuthModal />

      <AddVendorModal />

      {sidebarOpen && (
        <>
          <div
            onClick={() =>
              setSidebarOpen(false)
            }
            style={{
              position: "fixed",
              inset: 0,

              background:
                "rgba(0,0,0,0.3)",

              backdropFilter:
                "blur(10px)",

              zIndex: 180,
            }}
          />

          <div
            style={{
              position: "fixed",

              top: 0,
              right: 0,

              width: 320,
              height: "100vh",

              background: "white",

              zIndex: 200,

              padding: 24,

              boxShadow:
                "-10px 0 40px rgba(0,0,0,0.15)",

              display: "flex",

              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: 32,

                fontWeight: 800,
              }}
            >
              {user
                ? user?.email?.[0]?.toUpperCase()
                : "👤"}
            </div>

            <div
              style={{
                marginTop: 12,

                opacity: 0.65,

                wordBreak:
                  "break-word",
              }}
            >
              {user?.email || "Guest User"}
            </div>

            <div
              style={{
                marginTop: 40,

                display: "flex",

                flexDirection: "column",

                gap: 12,
              }}
            >
              {!user ? (
                <button
                  onClick={() => {
                    setSidebarOpen(false);

                    openSignup();
                  }}
                  style={{
                    padding: 16,

                    border: "none",

                    borderRadius: 16,

                    background: "#111",

                    color: "white",

                    fontWeight: 700,

                    cursor: "pointer",
                  }}
                >
                  Login / Sign Up
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  style={{
                    padding: 16,

                    border: "none",

                    borderRadius: 16,

                    background: "#111",

                    color: "white",

                    fontWeight: 700,

                    cursor: "pointer",
                  }}
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </>
      )}

      <button
        onClick={() =>
          setSidebarOpen(true)
        }
        style={{
          position: "fixed",

          top: 20,
          right: 20,

          width: 52,
          height: 52,

          borderRadius: "50%",

          border: "none",

          background: "#111",

          color: "white",

          fontSize: 18,

          fontWeight: 800,

          cursor: "pointer",

          zIndex: 150,

          boxShadow:
            "0 10px 30px rgba(0,0,0,0.22)",
        }}
      >
        {user
          ? user?.email?.[0]?.toUpperCase()
          : "👤"}
      </button>

      <button
        onClick={() => {
          if (!user) {
            setSidebarOpen(false);

            openSignup();

            return;
          }

          openAddVendor();
        }}
        style={{
          position: "fixed",

          right: 24,
          bottom: 24,

          zIndex: 120,

          border: "none",

          borderRadius: 999,

          padding: "16px 22px",

          background: "#111",

          color: "white",

          fontWeight: 700,

          fontSize: 15,

          cursor: "pointer",

          boxShadow:
            "0 10px 30px rgba(0,0,0,0.22)",
        }}
      >
        + Add Spot
      </button>

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