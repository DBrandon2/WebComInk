import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { READING_MODE_OPTIONS } from '../utils/constants';

export default function ReadingModeSelector({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        listRef.current &&
        !listRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "absolute",
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, [open]);

  const current = READING_MODE_OPTIONS.find((m) => m.value === value);
  const currentLabel = current ? current.label : "Sélectionner...";

  return (
    <div
      className="relative min-w-[220px] max-w-[520px] w-full"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button
        ref={buttonRef}
        className="bg-gray-800 text-white border border-white rounded px-4 py-2 text-base font-semibold w-full truncate shadow focus:border-white focus:outline-none cursor-pointer flex items-center justify-between gap-2"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        type="button"
      >
        <span className="truncate text-left">{currentLabel}</span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open &&
        typeof window !== "undefined" &&
        createPortal(
          <ul
            ref={listRef}
            tabIndex={-1}
            className="max-h-72 overflow-auto rounded bg-gray-900 border border-white shadow-lg animate-fade-in"
            style={dropdownStyle}
            role="listbox"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {READING_MODE_OPTIONS.map((mode) => (
              <li
                key={mode.value}
                role="option"
                aria-selected={mode.value === value}
                className={`px-4 py-2 cursor-pointer select-none truncate transition-colors duration-150 
                  ${
                    mode.value === value
                      ? "bg-accent/30 text-accent font-bold"
                      : "text-white"
                  }
                  hover:bg-accent/40 hover:text-accent`}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  onChange(mode.value);
                  setOpen(false);
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onChange(mode.value);
                    setOpen(false);
                  }
                }}
              >
                {mode.label}
              </li>
            ))}
          </ul>,
          document.body
        )}
    </div>
  );
} 