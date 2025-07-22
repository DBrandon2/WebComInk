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
      className={`fixed bottom-36 left-6 z-50 w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl backdrop-saturate-150 border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.25)] flex items-center justify-center md:hidden text-accent transition-colors duration-200 hover:bg-white/20`}
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
