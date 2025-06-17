import React, { useState } from "react";
import TopBarMobile from "./TopBarMobile";
import SwitchBtn from "../../components/shared/SwitchBtn";
import SortComics from "./SortComics";
import { motion } from "framer-motion";
import MangaList from "./MangaList";

export default function Comics() {
  const [activeFilter, setActiveFilter] = useState("enCours");
  const [previousFilter, setPreviousFilter] = useState(null);
  const [sort, setSort] = useState("Populaire");

  const handleSwitchClick = (newFilter) => {
    setPreviousFilter(activeFilter);
    setActiveFilter(newFilter);
  };

  const handleAllClick = () => {
    setPreviousFilter(activeFilter);
    setActiveFilter("tous");
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
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
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-0">
        <SwitchBtn
          btnleft="En cours"
          btnright="Terminé"
          activeFilter={activeFilter}
          previousFilter={previousFilter}
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

      <MangaList sort={sort} />
    </div>
  );
}
