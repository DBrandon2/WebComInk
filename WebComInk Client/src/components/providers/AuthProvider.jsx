import React, { useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useLoaderData } from "react-router-dom";
import { signOut } from "../../apis/auth.api";
import { getCurrentUser } from "../../apis/auth.api";

export default function AuthProvider({ children }) {
  const initialUser = useLoaderData();
  const [user, setUser] = useState(initialUser);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate depuis localStorage uniquement si 'rememberMe' est présent
  useEffect(() => {
    async function hydrate() {
      if (!initialUser) {
        if (localStorage.getItem("rememberMe") === "true") {
          const stored = localStorage.getItem("user");
          if (stored) {
            setUser(JSON.parse(stored));
          }
        } else {
          // Sinon, hydrate depuis le backend (session)
          const current = await getCurrentUser();
          if (current) setUser(current);
        }
      }
      setIsLoading(false);
    }
    hydrate();
  }, [initialUser]);

  const login = async (credentials) => {
    setUser(credentials);
    if (localStorage.getItem("rememberMe") === "true") {
      localStorage.setItem("user", JSON.stringify(credentials));
    } else {
      localStorage.removeItem("user");
    }
    // Hydrate avec le currentUser complet
    const current = await getCurrentUser();
    if (current) {
      setUser(current);
      if (localStorage.getItem("rememberMe") === "true") {
        localStorage.setItem("user", JSON.stringify(current));
      } else {
        localStorage.removeItem("user");
      }
    }
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");
  };
  return (
    <AuthContext.Provider value={{ user, login, logout, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
