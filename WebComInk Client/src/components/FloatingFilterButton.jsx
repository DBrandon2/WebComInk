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
      className={`fixed bottom-28 left-6 z-50 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center md:hidden transition-all duration-300 text-accent`}
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
