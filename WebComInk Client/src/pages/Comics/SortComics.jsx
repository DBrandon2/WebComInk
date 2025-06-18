import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Flame, PlusCircle, ArrowDownAz, ArrowUpZa, Clock } from "lucide-react";

export default function SortComics({ activeSort, onSortChange }) {
  const sorts = [
    { label: "Popularité", icon: <Flame className="w-6 h-6 " /> },
    { label: "Chapitres récents", icon: <Clock className="w-6 h-6 " /> },
    { label: "Nouveaux mangas", icon: <PlusCircle className="w-6 h-6" /> },
    { label: "A à Z", icon: <ArrowDownAz className="w-6 h-6 " /> },
    { label: "Z à A", icon: <ArrowUpZa className="w-6 h-6 " /> },
  ];

  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = (sortLabel) => {
    if (!isDragging && sortLabel !== activeSort) {
      onSortChange(sortLabel);
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
        {sorts.map(({ label, icon }) => (
          <motion.button
            key={label}
            onClick={() => handleClick(label)}
            className={`flex items-center px-6 py-3 whitespace-nowrap rounded-md transition-all ${
              activeSort === label
                ? "bg-accent text-dark-bg"
                : "bg-accent-hover text-gray-300 border border-accent"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex gap-2 justify-center items-center">
              {icon}
              <span>{label}</span>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
