import React from "react";
import { motion } from "framer-motion";

export default function SwitchBtn({
  btnleft,
  btnright,
  activeFilter,
  previousFilter,
  onSwitchClick,
}) {
  const isComingFromTous = previousFilter === "tous";
  const isEnCours = activeFilter === "enCours";
  const isTermine = activeFilter === "termine";

  let initialLeft = "0%";
  if (isComingFromTous) {
    initialLeft = isEnCours ? "-50%" : "100%"; // slide depuis hors écran à gauche ou droite
  } else if (previousFilter === "enCours" && activeFilter === "termine") {
    initialLeft = "0%"; // barre part de gauche et glisse vers droite
  } else if (previousFilter === "termine" && activeFilter === "enCours") {
    initialLeft = "50%"; // barre part de droite et glisse vers gauche
  } else {
    initialLeft = isEnCours ? "0%" : "50%";
  }

  return (
    <div className="relative flex w-full h-[64px] overflow-hidden bg-accent-hover">
      {/* Fond animé */}
      {activeFilter !== "tous" && (
        <motion.div
          className="absolute top-0 bottom-0 w-1/2 bg-accent z-0"
          style={{
            borderTopRightRadius: isEnCours ? "0.375rem" : "0",
            borderBottomRightRadius: isEnCours ? "0.375rem" : "0",
            borderTopLeftRadius: isEnCours ? "0" : "0.375rem",
            borderBottomLeftRadius: isEnCours ? "0" : "0.375rem",
          }}
          initial={{ left: initialLeft, opacity: 0 }}
          animate={{ left: isEnCours ? "0%" : "50%", opacity: 1 }}
          transition={{ type: "spring", stiffness: 250, damping: 20 }}
        />
      )}

      {/* Bouton "En cours" */}
      <div className="flex-1 relative z-10 overflow-hidden">
        <button
          className={`w-full h-full transition-colors duration-300 font-semibold relative z-10 ${
            isEnCours ? "text-dark-bg" : "text-gray-400"
          }`}
          onClick={() => onSwitchClick("enCours")}
        >
          {btnleft}
        </button>
      </div>

      {/* Bouton "Terminé" */}
      <div className="flex-1 relative z-10 overflow-hidden">
        <button
          className={`w-full h-full transition-colors duration-300 font-semibold relative z-10 ${
            isTermine ? "text-dark-bg" : "text-gray-400"
          }`}
          onClick={() => onSwitchClick("termine")}
        >
          {btnright}
        </button>
      </div>
    </div>
  );
}
