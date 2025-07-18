import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomSelect({
  options,
  value,
  onChange,
  className = "",
  renderOption,
  renderValue,
  placeholder = "Sélectionner...",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const selected = options.find((opt) => opt.value === value);

  return (
    <div className={`relative w-full md:w-[30%] ${className}`} ref={ref}>
      <button
        type="button"
        className="bg-white w-full py-2 px-4 rounded-md text-start flex justify-between items-center cursor-pointer relative text-dark-bg"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        tabIndex={0}
      >
        {selected ? (
          renderValue ? (
            renderValue(selected)
          ) : (
            <span className="flex items-center gap-2 font-semibold text-dark-bg">
              {selected.icon && typeof selected.icon === "function" && (
                <selected.icon className="w-5 h-5 mr-1" color="currentColor" />
              )}
              <span className="text-dark-bg">{selected.label}</span>
            </span>
          )
        ) : (
          <span className="font-semibold text-dark-bg">{placeholder}</span>
        )}
        <IoIosArrowDown
          className="text-dark-bg transition-transform"
          style={{ transform: open ? "rotate(180deg)" : undefined }}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="bg-white rounded-md shadow-lg z-20 overflow-hidden origin-top mt-2"
            role="listbox"
            style={{ willChange: "height" }}
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                className={`px-4 py-2 cursor-pointer flex items-center justify-between transition-colors select-none hover:bg-accent text-dark-bg  ${
                  opt.value === value ? "font-medium" : ""
                }`}
                onClick={() => {
                  onChange(opt.value);
                  // La sélection visuelle est immédiate
                  setTimeout(() => setOpen(false), 0);
                }}
              >
                {renderOption ? (
                  renderOption(opt)
                ) : (
                  <span
                    className={
                      opt.value === value
                        ? "font-medium text-accent"
                        : undefined
                    }
                  >
                    {opt.label}
                  </span>
                )}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
