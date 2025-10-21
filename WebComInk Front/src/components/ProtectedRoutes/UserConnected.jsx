import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function UserConnected({ children }) {
  const { user, isLoading } = useContext(AuthContext);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-accent text-xl">
        Chargement...
      </div>
    );
  }
  return user ? children : <Navigate to="/Auth" />;
}
