import React from "react";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";
// import { SlidersHorizontal } from "lucide-react";

export default function FloatingFilterButton({
  onClick,
  isOpen,
  hasActiveFilters = false,
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`fixed bottom-36 left-6 z-50 w-14 h-14 rounded-full shadow-2xl drop-shadow-lg flex items-center justify-center md:hidden bg-dark-bg/25 backdrop-blur-lg text-accent`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <div className="relative">
        <Filter className="w-7 h-7" />
        {hasActiveFilters && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full "></div>
        )}
      </div>
    </motion.button>
  );
}
