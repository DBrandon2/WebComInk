import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import viteLogo from "../../assets/logo/chat-mignon-baillant-somnolent-cartoon-vector-icon-illustration-concept-icone-nature-animale-isole-vecteur-premium-style-dessin-anime-plat.png";

export default function PageLoader({ show = true }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-dark-bg/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Effet "bulle manga" */}
          <motion.div
            className="relative flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
          >
            {/* Logo ou mascotte */}
            <motion.img
              src={viteLogo}
              alt="WebComInk logo"
              className="w-24 h-24 rounded-full shadow-lg border-4 border-accent bg-white object-cover mb-4"
              initial={{ rotate: -10 }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            {/* Bandeau animé façon "page manga" */}
            <motion.div
              className="w-48 h-4 bg-accent rounded-full shadow-md mb-6"
              initial={{ scaleX: 0.5 }}
              animate={{ scaleX: [0.5, 1.1, 1] }}
              transition={{
                duration: 0.7,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
            {/* Texte animé */}
            <motion.div
              className="text-accent text-lg font-bold tracking-widest drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Chargement…
            </motion.div>
            {/* Effet "bulle" manga */}
            <motion.div
              className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/10 rounded-full blur-lg"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
