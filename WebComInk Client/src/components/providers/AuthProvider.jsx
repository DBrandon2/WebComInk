import React, { useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useLoaderData } from "react-router-dom";
import { signOut } from "../../apis/auth.api";
import { getCurrentUser } from "../../apis/auth.api";

export default function AuthProvider({ children }) {
  const initialUser = useLoaderData();
  const [user, setUser] = useState(initialUser);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate depuis localStorage si besoin
  useEffect(() => {
    async function hydrate() {
      if (!initialUser) {
        const stored = localStorage.getItem("user");
        if (stored) {
          setUser(JSON.parse(stored));
        }
      }
      setIsLoading(false);
    }
    hydrate();
  }, [initialUser]);

  const login = async (credentials) => {
    setUser(credentials); // Pour compatibilité immédiate
    localStorage.setItem("user", JSON.stringify(credentials));
    // Hydrate avec le currentUser complet
    const current = await getCurrentUser();
    if (current) {
      setUser(current);
      localStorage.setItem("user", JSON.stringify(current));
    }
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    localStorage.removeItem("user");
  };
  return (
    <AuthContext.Provider value={{ user, login, logout, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
