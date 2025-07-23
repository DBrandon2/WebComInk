import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo/chat-mignon-baillant-somnolent-cartoon-vector-icon-illustration-concept-icone-nature-animale-isole-vecteur-premium-style-dessin-anime-plat.png";

export default function ValidationSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg px-4">
      <div className="flex flex-col items-center bg-gray-800/80 rounded-2xl shadow-lg p-8 max-w-md w-full">
        <img
          src={logo}
          alt="Logo WebComInk"
          className="w-24 h-24 mb-4 drop-shadow-lg animate-bounce"
        />
        <h1 className="text-accent text-3xl font-bold mb-2 text-center">
          Bienvenue sur WebComInk !
        </h1>
        <p className="text-gray-200 text-lg mb-6 text-center">
          Ton inscription a bien été validée.
          <br />
          Tu peux maintenant te connecter et profiter de toutes les
          fonctionnalités de la plateforme !
        </p>
        <NavLink
          to="/auth"
          className="bg-accent text-dark-bg px-6 py-3 rounded-lg font-semibold text-lg shadow hover:bg-accent/90 transition mb-2"
        >
          Se connecter
        </NavLink>
        <NavLink
          to="/"
          className="text-gray-400 text-sm hover:text-accent transition"
        >
          Retour à l'accueil
        </NavLink>
      </div>
    </div>
  );
}
