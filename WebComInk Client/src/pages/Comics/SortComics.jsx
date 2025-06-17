import { useState } from "react";
import { useRef } from "react";
import { motion } from "framer-motion";

export default function SortComics({ activeSort, onSortChange }) {
  const sorts = ["Populaire", "Nouveauté", "A à Z", "Dernières sorties"];
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = (sort) => {
    if (!isDragging && sort !== activeSort) {
      onSortChange(sort);
    }
  };

  return (
    <div
      className="flex overflow-x-hidden w-full py-4 scrollBar"
      ref={containerRef}
    >
      <motion.div
        className="flex space-x-4 px-2"
        drag="x"
        dragConstraints={containerRef}
        whileTap={{ cursor: "grabbing" }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      >
        {sorts.map((sort) => (
          <motion.button
            key={sort}
            onClick={() => handleClick(sort)}
            className={`px-8 py-4 whitespace-nowrap rounded-md ${
              activeSort === sort
                ? "bg-accent text-dark-bg"
                : "bg-accent-hover text-gray-300 border-accent border-1"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ margin: "0 8px" }}
          >
            {sort}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
