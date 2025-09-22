import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { buildApiUrl } from "../utils/apiConfig";
import CryptoJS from "crypto-js";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, setUser, setAccessToken, clearSession, startSessionTimer } = useContext(AuthContext);
  const navigate = useNavigate();

  const login = async (username, password) => {
    setIsLoading(true);
    setError("");

    // Validación básica
    if (!username.trim() || !password.trim()) {
      setError("CIF de empresa y contraseña son obligatorios");
      setIsLoading(false);
      return { success: false };
    }

    try {
      // Generar hash MD5 de la contraseña
      const hashedPassword = CryptoJS.MD5(password).toString();

      // Preparar el body de la petición
      const loginData = {
        username: username,
        password: hashedPassword
      };

      // Realizar petición al backend - cambio de sessions a tokens
      const apiUrl = buildApiUrl('USERS', '/api/v1/tokens');
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      if (response.ok) {
        const tokenData = await response.json();

        // Obtener información del usuario usando el accessToken
        const userInfoUrl = buildApiUrl('USERS', `/api/v1/users/${username}`);
        console.log("Lanzando peticion con accessToken:", tokenData.accessToken);
        const userResponse = await fetch(userInfoUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenData.accessToken}`
          }
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();

          // Login exitoso - almacenar accessToken y datos completos del usuario
          setAccessToken(tokenData.accessToken);
          setUser({
            ...userData,
            accessToken: tokenData.accessToken
          });

          console.log("Login exitoso para:", userData.name);
          setIsLoading(false);
          return { success: true };
        } else {
          throw new Error(`Error al obtener información del usuario: ${userResponse.status}`);
        }
      } else if (response.status === 401) {
        setError("Credenciales incorrectas");
        setIsLoading(false);
        return { success: false };
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.error("Error en login:", err);
      setError("Error en el servidor. Inténtalo de nuevo.");
      setIsLoading(false);
      return { success: false };
    }
  };

  const renewSession = async (currentAccessToken) => {
    try {
      // Hacer petición POST para renovar el token
      const renewalUrl = buildApiUrl('USERS', `/api/v1/tokens/${currentAccessToken}/renewals`);
      const response = await fetch(renewalUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentAccessToken}`
        }
      });

      if (response.ok) {
        const tokenData = await response.json();

        // Actualizar el token en el contexto con el nuevo accessToken
        setAccessToken(tokenData.accessToken);
        if (user) {
          setUser({
            ...user,
            accessToken: tokenData.accessToken
          });
        }

        // Reiniciar el temporizador
        startSessionTimer();
        console.log("Token renovado exitosamente:", tokenData.accessToken);
        return { success: true };
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.error("Error renovando token:", err);
      // Si falla la renovación, cerrar sesión
      clearSession();
      navigate("/");
      return { success: false };
    }
  };

  const logout = () => {
    clearSession();
    navigate("/");
  };

  return {
    login,
    logout,
    renewSession,
    isLoading,
    error,
    clearError: () => setError("")
  };
}
