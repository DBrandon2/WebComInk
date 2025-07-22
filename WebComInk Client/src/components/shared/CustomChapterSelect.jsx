import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";

export default function CustomChapterSelect({
  chapters = [],
  currentChapterId,
  onSelect,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  // Fermer le menu si clic en dehors
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

  // Ajout d'un gestionnaire natif pour le scroll confiné
  useEffect(() => {
    const el = listRef.current;
    if (!open || !el) return;
    function handleWheel(e) {
      const atTop = el.scrollTop === 0;
      const atBottom = el.scrollHeight - el.scrollTop === el.clientHeight;
      if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
        e.preventDefault();
      }
    }
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, [open]);

  // Gérer l'ouverture et le positionnement de la dropdown
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

  // Accessibilité clavier : ouvrir/fermer avec Entrée/Espace, navigation avec flèches
  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      setOpen((o) => !o);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const current = chapters.find((ch) => ch.id === currentChapterId);
  const currentLabel = current
    ? `Chapitre - ${current.attributes.chapter || "?"}${
        current.attributes.title
          ? " : " + current.attributes.title.slice(0, 60)
          : ""
      }`
    : "Sélectionner un chapitre";

  return (
    <div
      className={`relative min-w-[220px] max-w-[520px] w-full ${className}`}
      data-chapter-select="true"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button
        ref={buttonRef}
        className="bg-gray-800 text-white border border-white rounded px-4 py-1 text-base font-semibold w-full truncate shadow focus:border-white focus:outline-none cursor-pointer flex items-center justify-between gap-2"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        onKeyDown={handleKeyDown}
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
        ReactDOM.createPortal(
          <ul
            ref={listRef}
            tabIndex={-1}
            className="max-h-72 overflow-auto rounded bg-gray-900 border border-white shadow-lg animate-fade-in"
            style={dropdownStyle}
            role="listbox"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {chapters.map((ch) => {
              const label = `Chapitre - ${ch.attributes.chapter || "?"}${
                ch.attributes.title
                  ? " : " + ch.attributes.title.slice(0, 60)
                  : ""
              }`;
              return (
                <li
                  key={ch.id}
                  role="option"
                  aria-selected={ch.id === currentChapterId}
                  className={`px-4 py-2 cursor-pointer hover:bg-accent/20 text-white truncate ${
                    ch.id === currentChapterId ? "bg-accent/30 font-bold" : ""
                  }`}
                  onClick={() => {
                    onSelect(ch.id);
                    setOpen(false);
                  }}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      onSelect(ch.id);
                      setOpen(false);
                    }
                  }}
                >
                  {label}
                </li>
              );
            })}
          </ul>,
          document.body
        )}
    </div>
  );
}
