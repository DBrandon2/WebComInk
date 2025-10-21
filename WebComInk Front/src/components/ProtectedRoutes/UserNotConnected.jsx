import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function UserNotConnected({ children }) {
  const { user } = useContext(AuthContext);
  return !user ? children : <Navigate to="/" />;
}
