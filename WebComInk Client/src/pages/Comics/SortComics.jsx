import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  PlusCircle,
  ArrowDownAz,
  ArrowUpZa,
  Clock,
  Calendar,
  CalendarDays,
} from "lucide-react";

export default function SortComics({
  activeSort,
  onSortChange,
  sidebarMode = false,
}) {
  const sorts = [
    { label: "Popularité", icon: <Flame className="w-6 h-6 " /> },
    { label: "Chapitres récents", icon: <Clock className="w-6 h-6 " /> },
    { label: "Nouveaux mangas", icon: <PlusCircle className="w-6 h-6" /> },
    {
      label: "Date de parution (récent)",
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      label: "Date de parution (ancien)",
      icon: <CalendarDays className="w-6 h-6" />,
    },
    { label: "A à Z", icon: <ArrowDownAz className="w-6 h-6 " /> },
    { label: "Z à A", icon: <ArrowUpZa className="w-6 h-6 " /> },
  ];

  // Si trop d'options, on passe en select (ici seuil arbitraire à 6)
  const useSelect = sorts.length > 6 && sidebarMode;

  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = (sortLabel) => {
    if (!isDragging && sortLabel !== activeSort) {
      onSortChange(sortLabel);
    }
  };

  if (sidebarMode) {
    // Affichage colonne ou select
    return (
      <div className="flex flex-col gap-3 w-full">
        <span className="text-accent font-semibold mb-1">Trier par</span>
        {useSelect ? (
          <select
            className="w-full rounded border border-accent bg-dark-bg text-white py-2 px-3"
            value={activeSort}
            onChange={(e) => handleClick(e.target.value)}
          >
            {sorts.map(({ label }) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        ) : (
          sorts.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => handleClick(label)}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-all text-left w-full font-medium ${
                activeSort === label
                  ? "bg-accent text-dark-bg"
                  : "bg-accent-hover text-gray-300 border border-accent"
              }`}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))
        )}
      </div>
    );
  }

  // Affichage mobile (scroll horizontal)
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
