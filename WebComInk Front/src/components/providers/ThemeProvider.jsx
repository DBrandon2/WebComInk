import React, { useEffect, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme : "neon";
  });

  const [font, setFont] = useState(() => {
    const savedFont = localStorage.getItem("font");
    return savedFont ? savedFont : "defaut";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Supprimer toutes les classes de thème existantes
    root.classList.remove("theme-neon", "theme-clair");

    // Ajouter la classe du thème actuel
    root.classList.add(`theme-${theme}`);

    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;

    // Supprimer toutes les classes de police existantes
    root.classList.remove("font-defaut", "font-opendyslexic");

    // Ajouter la classe de police actuelle
    root.classList.add(`font-${font}`);

    localStorage.setItem("font", font);
  }, [font]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const changeFont = (newFont) => {
    setFont(newFont);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "neon" ? "clair" : "neon"));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        font,
        changeTheme,
        changeFont,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
