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
      className={`fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 md:hidden bg-accent text-dark-bg `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
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
