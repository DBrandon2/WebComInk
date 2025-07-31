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
      <style>{`
        [data-chapter-select="true"] ul::-webkit-scrollbar {
          width: 8px;
        }
        [data-chapter-select="true"] ul::-webkit-scrollbar-thumb {
          background: #18181b;
          border-radius: 12px;
        }
        [data-chapter-select="true"] ul::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 12px;
        }
        [data-chapter-select="true"] ul {
          scrollbar-width: thin;
          scrollbar-color: #18181b transparent;
        }

      `}</style>
      <button
        ref={buttonRef}
        className="bg-white text-dark-bg rounded px-4 py-2 text-base font-medium w-full truncate shadow cursor-pointer flex items-center justify-between gap-2"
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
            className="max-h-72 overflow-auto rounded bg-white shadow-lg z-20 animate-fade-in mt-2 pr-2"
            style={dropdownStyle}
            role="listbox"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {/* On n'affiche plus l'option sélectionnée dans la dropdown */}
            {/* Les autres options, même style que CustomSelect */}
            {[...chapters].reverse().map((ch) => {
              const label = `Chapitre - ${ch.attributes.chapter || "?"}${
                ch.attributes.title
                  ? " : " + ch.attributes.title.slice(0, 60)
                  : ""
              }`;
              const isSelected = ch.id === currentChapterId;
              return (
                <li
                  key={ch.id}
                  role="option"
                  aria-selected={isSelected}
                  className={`px-4 py-2 cursor-pointer flex items-center justify-between transition-colors transition-transform select-none 
                    ${
                      isSelected
                        ? "bg-accent text-dark-bg font-semibold"
                        : "text-dark-bg"
                    }`}
                  style={
                    !isSelected
                      ? {
                          transition: "transform 0.15s",
                          willChange: "transform",
                        }
                      : undefined
                  }
                  onMouseEnter={(e) => {
                    if (!isSelected)
                      e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.transform = "";
                  }}
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
