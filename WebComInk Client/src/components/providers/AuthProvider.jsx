import React, { useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useLoaderData } from "react-router-dom";
import { signOut } from "../../apis/auth.api";

export default function AuthProvider({ children }) {
  const initialUser = useLoaderData();
  const [user, setUser] = useState(initialUser);
  const login = (credentials) => {
    setUser(credentials);
  };

  const logout = async () => {
    await signOut();
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
