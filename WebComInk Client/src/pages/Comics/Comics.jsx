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
    <div className="flex flex-col gap-8 mt-12 md:mt-24">
      <TopBarMobile />
      <div className="flex w-full h-full xl:justify-center">
        <div className="flex w-full justify-center lg:justify-between items-center lg:px-7">
          <div className="flex flex-col items-center ">
            <h1 className="text-3xl text-accent text-center md:text-start font-medium tracking-wider md:text-4xl w-full">
              Liste des Mangas
            </h1>
            <h2 className="text-center lg:text-start font-light w-[90%] md:w-full">
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
      {/* Section centrée pour SwitchBtn et bouton Tous */}
      <div className="w-full flex flex-col items-center justify-center mt-8 mb-2">
        <SwitchBtn
          btnleft="En cours"
          btnright="Terminé"
          activeFilter={activeFilter}
          onSwitchClick={handleSwitchClick}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`mt-4 px-16 rounded-md h-[48px] cursor-pointer md:px-28 ${
            activeFilter === "tous"
              ? "bg-accent text-dark-bg"
              : "bg-accent-hover text-gray-300"
          }`}
          onClick={handleAllClick}
        >
          Tous
        </motion.button>
      </div>
      {/* Layout deux colonnes sur desktop */}
      <div className="flex flex-col lg:flex-row gap-8 w-full">
        {/* Sidebar desktop responsive */}
        <aside className="hidden lg:flex flex-col gap-8 w-full max-w-xs min-w-[220px] bg-dark-bg/70 rounded-xl h-fit self-start px-4 ml-8 ">
          <SortComics
            activeSort={sort}
            onSortChange={handleSortChange}
            sidebarMode={true}
          />
          <div className="flex flex-col gap-4">
            <span className="text-accent font-semibold mb-1 ">
              Filtrer par genre
            </span>
            <FilterGenreBtn
              isOpen={true}
              onClose={handleFilterClose}
              selectedGenres={selectedTags}
              excludedGenres={excludedTags}
              onGenreChange={handleGenreChange}
              sidebarMode={true}
            />
          </div>
        </aside>
        {/* Contenu principal */}
        <main className="flex-1 flex flex-col gap-6">
          {/* SortComics et filtres cachés sur mobile, visibles dans la sidebar */}
          <div className="lg:hidden flex flex-col gap-4">
            <SortComics activeSort={sort} onSortChange={handleSortChange} />
            <FloatingFilterButton
              onClick={handleFilterToggle}
              isOpen={isFilterOpen}
              hasActiveFilters={
                selectedTags.length > 0 || excludedTags.length > 0
              }
            />
            <FilterGenreBtn
              isOpen={isFilterOpen}
              onClose={handleFilterClose}
              selectedGenres={selectedTags}
              excludedGenres={excludedTags}
              onGenreChange={handleGenreChange}
            />
          </div>
          <MangaList
            sort={sort}
            filter={activeFilter}
            includedTags={selectedTags}
            excludedTags={excludedTags}
          />
        </main>
      </div>
    </div>
  );
}
