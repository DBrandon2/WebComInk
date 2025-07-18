import React, { useState, useEffect, useRef } from "react";
import { HiOutlineMagnifyingGlass, HiXMark } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import { getMangasByTitle } from "../../services/mangaService";
import { useNavigate } from "react-router-dom";
import { slugify } from "../../utils/mangaUtils";

export default function SearchBar({
  isOpen,
  onToggle,
  onClose,
  isMobile = false,
  className = "",
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  // Focus sur l'input quand la barre s'ouvre
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Fermer la recherche quand on clique à l'extérieur
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        onClose();
        setShowResults(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Fonction de recherche avec debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        searchMangas(searchQuery.trim());
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500); // debounce augmenté à 500ms

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const searchMangas = async (query) => {
    setIsLoading(true);
    try {
      const response = await getMangasByTitle({
        title: query,
        limit: 10,
        lang: "fr",
        includes: ["cover_art"],
      });
      setSearchResults(response.data || []);
      setShowResults(true);
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMangaClick = (manga) => {
    const title =
      manga.attributes?.title?.fr ||
      manga.attributes?.title?.en ||
      manga.attributes?.title?.["ja-ro"] ||
      Object.values(manga.attributes?.title || {})[0] ||
      "";
    navigate(`/Comics/${manga.id}/${slugify(title)}`);
    onClose();
    setSearchQuery("");
    setShowResults(false);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    searchInputRef.current?.focus();
  };

  const getMangaCoverUrl = (manga) => {
    const coverArt = manga.relationships?.find(
      (rel) => rel.type === "cover_art"
    );
    if (coverArt && coverArt.attributes?.fileName) {
      return `https://uploads.mangadex.org/covers/${manga.id}/${coverArt.attributes.fileName}.256.jpg`;
    }
    return "/placeholder-manga.jpg"; // Image par défaut
  };

  const getMangaTitle = (manga) => {
    const title = manga.attributes?.title;
    return (
      title?.fr ||
      title?.en ||
      title?.["ja-ro"] ||
      Object.values(title || {})[0] ||
      "Titre non disponible"
    );
  };

  // Version mobile : affichage direct sans bouton
  if (isMobile) {
    return (
      <div
        ref={searchContainerRef}
        className={`w-full ${className}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="bg-dark-bg/95 backdrop-blur-lg rounded-lg border border-gray-600 overflow-hidden">
          <div className="flex items-center p-3">
            <HiOutlineMagnifyingGlass className="text-gray-400 text-xl mr-3" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un manga..."
              className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  onClose();
                }
              }}
            />
            {searchQuery && (
              <button
                onClick={handleClear}
                className="text-gray-400 hover:text-white ml-2"
              >
                <HiXMark className="text-xl" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white ml-2 cursor-pointer"
            >
              <HiXMark className="text-xl" />
            </button>
          </div>

          {/* Résultats de recherche mobile */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-600 max-h-96 overflow-y-auto"
              >
                {isLoading ? (
                  <div className="p-4 text-center text-gray-400">
                    Recherche en cours...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((manga) => (
                      <button
                        key={manga.id}
                        onClick={() => handleMangaClick(manga)}
                        className="w-full flex items-center p-3 hover:bg-gray-700/50 transition-colors duration-200 text-left"
                      >
                        <img
                          src={getMangaCoverUrl(manga)}
                          alt={getMangaTitle(manga)}
                          className="w-12 h-16 object-cover rounded mr-3 flex-shrink-0"
                          onError={(e) => {
                            e.target.src = "/placeholder-manga.jpg";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium truncate">
                            {getMangaTitle(manga)}
                          </h3>
                          <p className="text-gray-400 text-sm truncate">
                            {manga.attributes?.status || "Statut inconnu"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : searchQuery.trim().length >= 2 ? (
                  <div className="p-4 text-center text-gray-400">
                    Aucun résultat trouvé pour "{searchQuery}"
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={searchContainerRef}
      className={`relative flex items-center h-full ${className}`}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Animation morphing bouton <-> searchbar */}
      <AnimatePresence initial={false}>
        {!isOpen && (
          <motion.button
            key="search-btn"
            layoutId="searchbar-anim"
            onClick={onToggle}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/20 shadow-lg text-[28px] hover:text-accent transition-all duration-300 cursor-pointer border-none outline-none"
            aria-label="Rechercher"
            initial={{
              width: 48,
              height: 48,
              backgroundColor: "rgba(255,255,255,0.20)",
              borderRadius: 999,
            }}
            animate={{
              width: 48,
              height: 48,
              backgroundColor: "rgba(255,255,255,0.20)",
              borderRadius: 999,
            }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <HiOutlineMagnifyingGlass />
          </motion.button>
        )}
        {isOpen && (
          <motion.div
            key="searchbar-open"
            layoutId="searchbar-anim"
            initial={{
              width: 48,
              height: 48,
              backgroundColor: "#23272f",
            }}
            animate={{
              width: 400,
              height: 48,
              backgroundColor: "rgba(255,255,255,0.20)",
              opacity: 1,
            }}
            exit={{ width: 48, height: 48, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="flex items-center overflow-hidden bg-white/20 backdrop-blur-md border border-white/20 shadow-lg transition-all duration-300"
            style={{ position: "static", overflow: "hidden", borderRadius: 8 }}
          >
            <div
              className="flex items-center w-full px-3"
              style={{ height: 48 }}
            >
              <HiOutlineMagnifyingGlass className="text-gray-400 text-xl mr-3" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un manga..."
                className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none h-[48px]"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    onClose();
                  }
                }}
                style={{ minWidth: 0 }}
              />
              {searchQuery && (
                <button
                  onClick={handleClear}
                  className="text-gray-400 hover:text-white ml-2 cursor-pointer"
                >
                  <HiXMark className="text-xl" />
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white ml-2 cursor-pointer"
              >
                <HiXMark className="text-xl" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Résultats de recherche */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute right-0 top-12 bg-dark-bg/95 backdrop-blur-lg rounded-lg overflow-hidden w-[400px] max-w-full z-10"
          >
            {/* Résultats de recherche */}
            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-600 max-h-96 overflow-y-auto"
                >
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-400">
                      Recherche en cours...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((manga) => (
                        <button
                          key={manga.id}
                          onClick={() => handleMangaClick(manga)}
                          className="w-full flex items-center p-3 hover:bg-gray-700/50 transition-colors duration-200 text-left"
                        >
                          <img
                            src={getMangaCoverUrl(manga)}
                            alt={getMangaTitle(manga)}
                            className="w-12 h-16 object-cover rounded mr-3 flex-shrink-0"
                            onError={(e) => {
                              e.target.src = "/placeholder-manga.jpg";
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-medium truncate">
                              {getMangaTitle(manga)}
                            </h3>
                            <p className="text-gray-400 text-sm truncate">
                              {manga.attributes?.status || "Statut inconnu"}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : searchQuery.trim().length >= 2 ? (
                    <div className="p-4 text-center text-gray-400">
                      Aucun résultat trouvé pour "{searchQuery}"
                    </div>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
