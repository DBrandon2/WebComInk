import React, { useState, useEffect, useRef } from "react";
import { HiOutlineMagnifyingGlass, HiXMark } from "react-icons/hi2";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { getMangasByTitle } from "../../services/mangaService";
import { useNavigate } from "react-router-dom";
import { slugify } from "../../utils/mangaUtils";

export default function SearchBar({
  isOpen,
  onToggle,
  onClose,
  isMobile = false,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Motion values for width + border radius
  const width = useMotionValue(isOpen ? 400 : 48);
  const borderRadius = useTransform(width, (w) => Math.min(24, w / 2));

  useEffect(() => {
    const controls = animate(width, isOpen ? 400 : 48, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
    return controls.stop;
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose();
        setShowResults(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onClose]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim().length >= 2) {
        fetchMangas(query.trim());
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  const fetchMangas = async (title) => {
    setLoading(true);
    try {
      const res = await getMangasByTitle({
        title,
        limit: 10,
        lang: "fr",
        includes: ["cover_art"],
      });
      setResults(res.data || []);
      setShowResults(true);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  const handleClick = (manga) => {
    const title =
      manga.attributes?.title?.fr ||
      manga.attributes?.title?.en ||
      Object.values(manga.attributes?.title || {})[0] ||
      "";
    navigate(`/Comics/${manga.id}/${slugify(title)}`);
    onClose();
    setQuery("");
    setShowResults(false);
  };

  const getCover = (m) => {
    const cover = m.relationships?.find((r) => r.type === "cover_art");
    return cover?.attributes?.fileName
      ? `https://uploads.mangadex.org/covers/${m.id}/${cover.attributes.fileName}.256.jpg`
      : "/placeholder-manga.jpg";
  };

  const getTitle = (m) => {
    const t = m.attributes?.title;
    return t?.fr || t?.en || Object.values(t || {})[0] || "Titre inconnu";
  };

  if (isMobile) {
    return (
      <div
        ref={containerRef}
        className="w-full z-20"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="bg-dark-bg/95 backdrop-blur-lg rounded-lg border border-gray-600">
          <div className="flex items-center p-3">
            <HiOutlineMagnifyingGlass className="text-gray-400 text-xl mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un manga..."
              className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
              onKeyDown={(e) => e.key === "Escape" && onClose()}
            />
            {query && (
              <button
                onClick={handleClear}
                className="text-gray-400 hover:text-white ml-2"
              >
                <HiXMark className="text-xl" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white ml-2"
            >
              <HiXMark className="text-xl" />
            </button>
          </div>

          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-600 max-h-96 overflow-y-auto"
              >
                {loading ? (
                  <div className="p-4 text-center text-gray-400">
                    Recherche en cours...
                  </div>
                ) : results.length > 0 ? (
                  results.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleClick(m)}
                      className="flex w-full p-3 hover:bg-gray-700/50 text-left"
                    >
                      <img
                        src={getCover(m)}
                        alt={getTitle(m)}
                        className="w-12 h-16 object-cover rounded mr-3"
                        onError={(e) =>
                          (e.target.src = "/placeholder-manga.jpg")
                        }
                      />
                      <div className="min-w-0">
                        <h3 className="text-white truncate">{getTitle(m)}</h3>
                        <p className="text-gray-400 text-sm truncate">
                          {m.attributes?.status || "Statut inconnu"}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-400">
                    Aucun résultat pour "{query}"
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-12 z-20"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <motion.div
        style={{ width, borderRadius }}
        className={`h-12 bg-white/10 backdrop-blur-xl flex items-center justify-between px-3 border border-white/20 overflow-hidden transition-colors duration-200 ${
          !isOpen ? "hover:bg-white/20 cursor-pointer" : ""
        }`}
      >
        {!isOpen ? (
          <button
            onClick={onToggle}
            className="text-white text-xl cursor-pointer"
          >
            <HiOutlineMagnifyingGlass />
          </button>
        ) : (
          <>
            <HiOutlineMagnifyingGlass className="text-gray-400 text-xl mr-2" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
              placeholder="Rechercher un manga..."
              onKeyDown={(e) => e.key === "Escape" && onClose()}
            />
            {query && (
              <button
                onClick={handleClear}
                className="text-gray-400 hover:text-white ml-2 cursor-pointer"
              >
                <HiXMark />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white ml-2 cursor-pointer"
            >
              <HiXMark />
            </button>
          </>
        )}
      </motion.div>

      <AnimatePresence>
        {isOpen && showResults && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-14 right-0 w-[400px] bg-dark-bg/95 rounded-lg border border-gray-600 backdrop-blur-lg max-h-96 overflow-y-auto"
          >
            {loading ? (
              <div className="p-4 text-center text-gray-400">
                Recherche en cours...
              </div>
            ) : results.length > 0 ? (
              results.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleClick(m)}
                  className="flex w-full p-3 hover:bg-gray-700/50 text-left cursor-pointer"
                >
                  <img
                    src={getCover(m)}
                    alt={getTitle(m)}
                    className="w-12 h-16 object-cover rounded mr-3"
                    onError={(e) => (e.target.src = "/placeholder-manga.jpg")}
                  />
                  <div className="min-w-0">
                    <h3 className="text-white truncate">{getTitle(m)}</h3>
                    <p className="text-gray-400 text-sm truncate">
                      {m.attributes?.status || "Statut inconnu"}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-400">
                Aucun résultat pour "{query}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
