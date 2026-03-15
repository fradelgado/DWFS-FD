import { createContext, useContext, useState } from "react";

// 1. Crear el contexto con un valor por defecto descriptivo
export const AppContext = createContext(null);

// 2. Provider: componente que envuelve la app y expone los valores globales
export function AppProvider({ children }) {
  const [theme, setTheme] = useState("dark"); // "dark" | "light"
  const [userName] = useState("Ada Lovelace");  // en un caso real vendría de auth

  function toggleTheme() {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      // Aplicamos la clase al <html> para que las variables CSS cambien
      document.documentElement.classList.toggle("light", next === "light");
      return next;
    });
  }

  return (
    <AppContext.Provider value={{ theme, toggleTheme, userName }}>
      {children}
    </AppContext.Provider>
  );
}

// 3. Custom hook de conveniencia para consumir el contexto sin importar dos cosas
export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext debe usarse dentro de <AppProvider>");
  return ctx;
}
