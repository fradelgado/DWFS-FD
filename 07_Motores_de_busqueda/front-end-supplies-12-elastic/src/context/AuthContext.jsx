import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [sessionTimer, setSessionTimer] = useState(null);
    const [showRenewalModal, setShowRenewalModal] = useState(false);

    // Función para limpiar la sesión
    const clearSession = () => {
        setUser(null);
        setAccessToken(null);
        setShowRenewalModal(false);
        if (sessionTimer) {
            clearTimeout(sessionTimer);
            setSessionTimer(null);
        }
    };

    // Función para iniciar el temporizador de sesión (4 minutos)
    const startSessionTimer = () => {
        if (sessionTimer) {
            clearTimeout(sessionTimer);
        }

        const timer = setTimeout(() => {
            setShowRenewalModal(true);
        }, 4 * 60 * 1000); // 4 minutos

        setSessionTimer(timer);
    };

    // Cuando se establece un accessToken, iniciar el temporizador
    useEffect(() => {
        if (accessToken) {
            startSessionTimer();
        }
        return () => {
            if (sessionTimer) {
                clearTimeout(sessionTimer);
            }
        };
    }, [accessToken]);

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            accessToken,
            setAccessToken,
            clearSession,
            showRenewalModal,
            setShowRenewalModal,
            startSessionTimer
        }}>
            {children}
        </AuthContext.Provider>
    );
};