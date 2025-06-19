import React from "react";
import { motion } from "framer-motion";

export default function SwitchBtn({
  btnleft,
  btnright,
  activeFilter,
  previousFilter,
  onSwitchClick,
}) {
  // Logique pour les différents contextes d'utilisation
  const isComingFromTous = previousFilter === "tous";
  const isEnCours = activeFilter === "enCours";
  const isTermine = activeFilter === "termine";
  const isConnexion = activeFilter === "Connexion";
  const isInscription = activeFilter === "Inscription";

  let initialLeft = "0%";
  let isLeftActive = false;
  let isRightActive = false;

  // Logique pour le contexte manga (enCours/termine)
  if (
    activeFilter === "enCours" ||
    activeFilter === "termine" ||
    previousFilter === "enCours" ||
    previousFilter === "termine" ||
    previousFilter === "tous"
  ) {
    if (isComingFromTous) {
      initialLeft = isEnCours ? "-50%" : "100%"; // slide depuis hors écran à gauche ou droite
    } else if (previousFilter === "enCours" && activeFilter === "termine") {
      initialLeft = "0%"; // barre part de gauche et glisse vers droite
    } else if (previousFilter === "termine" && activeFilter === "enCours") {
      initialLeft = "50%"; // barre part de droite et glisse vers gauche
    } else {
      initialLeft = isEnCours ? "0%" : "50%";
    }
    isLeftActive = isEnCours;
    isRightActive = isTermine;
  }
  // Logique pour le contexte auth (Connexion/Inscription)
  else {
    if (previousFilter === "Connexion" && activeFilter === "Inscription") {
      initialLeft = "0%"; // barre part de gauche et glisse vers droite
    } else if (
      previousFilter === "Inscription" &&
      activeFilter === "Connexion"
    ) {
      initialLeft = "50%"; // barre part de droite et glisse vers gauche
    } else {
      initialLeft = isConnexion ? "0%" : "50%";
    }
    isLeftActive = isConnexion;
    isRightActive = isInscription;
  }

  return (
    <div className="relative flex w-full h-[64px] overflow-hidden bg-accent-hover rounded-lg">
      {/* Fond animé */}
      {activeFilter !== "tous" && (
        <motion.div
          className="absolute top-0 bottom-0 w-1/2 bg-accent z-0 rounded-lg cursor-pointer"
          style={{
            borderTopRightRadius: isLeftActive ? "0.5rem" : "0",
            borderBottomRightRadius: isLeftActive ? "0.5rem" : "0",
            borderTopLeftRadius: isLeftActive ? "0" : "0.5rem",
            borderBottomLeftRadius: isLeftActive ? "0" : "0.5rem",
          }}
          initial={{ left: initialLeft, opacity: 0 }}
          animate={{ left: isLeftActive ? "0%" : "50%", opacity: 1 }}
          transition={{ type: "spring", stiffness: 250, damping: 20 }}
        />
      )}

      {/* Bouton gauche */}
      <div className="flex-1 relative z-10 overflow-hidden">
        <button
          className={`w-full h-full transition-colors duration-300 font-semibold relative z-10 cursor-pointer ${
            isLeftActive ? "text-dark-bg" : "text-gray-400"
          }`}
          onClick={() => onSwitchClick(btnleft)}
        >
          {btnleft}
        </button>
      </div>

      {/* Bouton droite */}
      <div className="flex-1 relative z-10 overflow-hidden">
        <button
          className={`w-full h-full transition-colors duration-300 font-semibold relative z-10 cursor-pointer ${
            isRightActive ? "text-dark-bg" : "text-gray-400"
          }`}
          onClick={() => onSwitchClick(btnright)}
        >
          {btnright}
        </button>
      </div>
    </div>
  );
}
