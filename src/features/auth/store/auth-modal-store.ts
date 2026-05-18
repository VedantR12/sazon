import { create } from "zustand";

type AuthModalState = {
    isOpen: boolean;

    mode: "login" | "signup";

    openLogin: () => void;

    openSignup: () => void;

    close: () => void;
};

export const useAuthModalStore =
    create<AuthModalState>((set) => ({
        isOpen: false,

        mode: "login",

        openLogin: () =>
            set({
                isOpen: true,
                mode: "login",
            }),

        openSignup: () =>
            set({
                isOpen: true,
                mode: "signup",
            }),

        close: () =>
            set({
                isOpen: false,
            }),
    }));