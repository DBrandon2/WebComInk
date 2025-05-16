import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import { FaMoon } from "react-icons/fa";
import { FaSun } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header
      className={`h-[58px] px-2 py-4 bg-white dark:bg-gray-800 shadow-2xs text-blue-600 flex flex-row items-center w-full`}
    >
      <div className="grow">
        <NavLink to="/">
          <strong>My App</strong>
        </NavLink>
      </div>
      <div className="flex items-center gap-4 mr-4">
        <button
          onClick={toggleTheme}
          className="text-xl hover:text-blue-400 transition"
        >
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </button>
      </div>
      <ul>
        {user ? (
          <>
            <a className="mr-4" href="#" onClick={logout}>
              <span>Déconnexion</span>
            </a>
            <NavLink className="mr-4" to="/profile">
              <span>Profile</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink className="mr-4" to="register">
              <span>Inscription</span>
            </NavLink>
            <NavLink className="mr-4" to="login">
              <span>Connexion</span>
            </NavLink>
          </>
        )}
      </ul>
    </header>
  );
}
