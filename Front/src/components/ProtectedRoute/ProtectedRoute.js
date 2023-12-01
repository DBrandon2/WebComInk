import { useContext } from "react";
import { AuthContext } from "../../context";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const {user} = useContext(AuthContext)
  return (
    user ? children : <Navigate to="/connexion"/>
  )
}

export default ProtectedRoute