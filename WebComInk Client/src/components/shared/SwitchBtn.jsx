import React from "react";
import { motion } from "framer-motion";

export default function SwitchBtn({
  btnleft,
  btnright,
  activeFilter,
  onSwitchClick,
}) {
  // Conversion des valeurs backend vers les valeurs d'affichage pour la comparaison
  const getDisplayValue = (backendValue) => {
    if (backendValue === "enCours") return "En cours";
    if (backendValue === "termine") return "Terminé";
    return backendValue;
  };

  const displayActiveFilter = getDisplayValue(activeFilter);

  // Comparaison avec les valeurs d'affichage
  const isLeftActive = displayActiveFilter === btnleft;
  const isRightActive = displayActiveFilter === btnright;
  const isTous = activeFilter === "tous";

  // Barre animée uniquement si un des deux boutons est actif (pas "tous")
  const showBar = isLeftActive || isRightActive;
  const barLeft = isLeftActive ? "0%" : "50%";

  return (
    <div className="relative flex w-full h-[64px] overflow-hidden bg-accent-hover rounded-lg">
      {/* Fond animé */}
      {showBar && (
        <motion.div
          className="absolute top-0 bottom-0 w-1/2 bg-accent z-0 rounded-lg cursor-pointer"
          style={{
            borderTopRightRadius: isLeftActive ? "0.5rem" : "0",
            borderBottomRightRadius: isLeftActive ? "0.5rem" : "0",
            borderTopLeftRadius: isRightActive ? "0.5rem" : "0",
            borderBottomLeftRadius: isRightActive ? "0.5rem" : "0",
          }}
          initial={{ left: barLeft, opacity: 0 }}
          animate={{ left: barLeft, opacity: 1 }}
          transition={{ type: "spring", stiffness: 250, damping: 20 }}
        />
      )}

      {/* Bouton gauche */}
      <div className="flex-1 relative z-10 overflow-hidden">
        <button
          className={`w-full h-full transition-colors duration-300 font-semibold relative z-10 cursor-pointer ${
            isLeftActive && showBar ? "text-dark-bg" : "text-gray-400"
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
            isRightActive && showBar ? "text-dark-bg" : "text-gray-400"
          }`}
          onClick={() => onSwitchClick(btnright)}
        >
          {btnright}
        </button>
      </div>
    </div>
  );
}
