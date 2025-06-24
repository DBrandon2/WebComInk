import React, { useState, useEffect } from "react";
import TopBarMobile from "./TopBarMobile";
import SwitchBtn from "../../components/shared/SwitchBtn";
import SortComics from "./SortComics";
import FloatingFilterButton from "../../components/FloatingFilterButton";
import FilterGenreBtn from "../../components/FilterGenreBtn";
import { motion } from "framer-motion";
import MangaList from "./MangaList";
import { useLocation } from "react-router-dom";

export default function Comics() {
  const location = useLocation();
  // Récupération des filtres depuis le sessionStorage si dispo
  const getInitialFilters = () => {
    try {
      const saved = JSON.parse(sessionStorage.getItem("comicsFilters"));
      if (saved) {
        return saved;
      }
    } catch {}
    return {
      sort: location.state?.sort || "Popularité",
      activeFilter: "enCours",
      selectedTags: [],
      excludedTags: [],
    };
  };
  const [sort, setSort] = useState(getInitialFilters().sort);
  const [activeFilter, setActiveFilter] = useState(
    getInitialFilters().activeFilter
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState(
    getInitialFilters().selectedTags
  );
  const [excludedTags, setExcludedTags] = useState(
    getInitialFilters().excludedTags
  );

  // Sauvegarde dans le sessionStorage à chaque changement de filtre
  useEffect(() => {
    sessionStorage.setItem(
      "comicsFilters",
      JSON.stringify({ sort, activeFilter, selectedTags, excludedTags })
    );
  }, [sort, activeFilter, selectedTags, excludedTags]);

  const handleSwitchClick = (newFilter) => {
    // Convertir les valeurs d'affichage vers les valeurs backend
    if (newFilter === "En cours") {
      setActiveFilter("enCours");
    } else if (newFilter === "Terminé") {
      setActiveFilter("termine");
    } else {
      setActiveFilter(newFilter);
    }
  };

  const handleAllClick = () => {
    setActiveFilter("tous");
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
  };

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterClose = () => {
    setIsFilterOpen(false);
  };

  const handleGenreChange = (tags) => {
    setSelectedTags(tags.included || []);
    setExcludedTags(tags.excluded || []);
  };

  return (
    <div className="flex flex-col gap-8">
      <TopBarMobile />
      <div className="flex w-full h-full xl:justify-center">
        <div className="flex w-full justify-center lg:justify-between items-center lg:px-7">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl text-accent text-center lg:text-start font-medium tracking-wider lg:text-4xl">
              Liste des Mangas
            </h1>
            <h2 className="text-center lg:text-start font-light w-[90%]">
              Le catalogue complet de WebComInk à ta disposition!
            </h2>
            {(selectedTags.length > 0 || excludedTags.length > 0) && (
              <div className="mt-2 text-sm text-accent">
                {selectedTags.length > 0 && (
                  <span className="text-green-400">
                    {selectedTags.length} inclus
                  </span>
                )}
                {selectedTags.length > 0 && excludedTags.length > 0 && " • "}
                {excludedTags.length > 0 && (
                  <span className="text-red-400">
                    {excludedTags.length} exclus
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-0">
        <SwitchBtn
          btnleft="En cours"
          btnright="Terminé"
          activeFilter={activeFilter}
          onSwitchClick={handleSwitchClick}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`mx-auto mt-4 px-16 rounded-md h-[48px] ${
            activeFilter === "tous"
              ? "bg-accent text-dark-bg"
              : "bg-accent-hover text-gray-300"
          }`}
          onClick={handleAllClick}
        >
          Tous
        </motion.button>
      </div>

      <SortComics activeSort={sort} onSortChange={handleSortChange} />

      <MangaList
        sort={sort}
        filter={activeFilter}
        includedTags={selectedTags}
        excludedTags={excludedTags}
      />

      {/* Bouton flottant pour mobile */}
      <FloatingFilterButton
        onClick={handleFilterToggle}
        isOpen={isFilterOpen}
        hasActiveFilters={selectedTags.length > 0 || excludedTags.length > 0}
      />

      {/* Interface de filtrage par genre */}
      <FilterGenreBtn
        isOpen={isFilterOpen}
        onClose={handleFilterClose}
        selectedGenres={selectedTags}
        excludedGenres={excludedTags}
        onGenreChange={handleGenreChange}
      />
    </div>
  );
}
