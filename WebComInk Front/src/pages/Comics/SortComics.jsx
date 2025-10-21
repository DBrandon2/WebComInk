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
import CustomSelect from "../../components/shared/CustomSelect";
import React from "react"; // Added missing import for React

export default function SortComics({
  activeSort,
  onSortChange,
  sidebarMode = false,
}) {
  const sorts = [
    { label: "Popularité", icon: Flame },
    { label: "Chapitres récents", icon: Clock },
    { label: "Nouveaux mangas", icon: PlusCircle },
    { label: "Date de parution (récent)", icon: Calendar },
    { label: "Date de parution (ancien)", icon: CalendarDays },
    { label: "A à Z", icon: ArrowDownAz },
    { label: "Z à A", icon: ArrowUpZa },
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
          <CustomSelect
            className="w-full min-w-[220px] md:w-[320px]"
            options={sorts.map(({ label, icon }) => ({
              value: label,
              label,
              icon,
            }))}
            value={activeSort}
            onChange={handleClick}
            renderOption={(option) => {
              const Icon = option.icon;
              return (
                <div className="flex items-center gap-2">
                  {Icon && (
                    <Icon className="w-5 h-5 mr-1" color="currentColor" />
                  )}
                  <span>{option.label}</span>
                </div>
              );
            }}
            renderValue={(option) => {
              const Icon = option.icon;
              return (
                <div className="flex items-center gap-2">
                  {Icon && (
                    <Icon className="w-5 h-5 mr-1" color="currentColor" />
                  )}
                  <span>{option.label}</span>
                </div>
              );
            }}
          />
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
        {sorts.map(({ label, icon: Icon }) => (
          <motion.button
            key={label}
            onClick={() => handleClick(label)}
            className={`flex items-center gap-2 px-6 py-3 whitespace-nowrap rounded-md transition-all ${
              activeSort === label
                ? "bg-accent text-dark-bg"
                : "bg-accent-hover text-gray-300 border border-accent"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {Icon && <Icon className="w-5 h-5 mr-1" color="currentColor" />}
            <span>{label}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
