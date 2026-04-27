"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
} from "react";

const AuthContext =
    createContext();

export const AuthProvider = ({
    children,
}) => {
    const [token, setToken] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("token") || "";
        }
        return "";
    });

    const login = (newToken) => {
        localStorage.setItem(
            "token",
            newToken
        );
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem(
            "token"
        );
        setToken("");
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () =>
    useContext(AuthContext);