import React from "react";
import TopBarMobile from "./TopBarMobile";
import ComicsFilter from "./ComicsFilter";

export default function Comics() {
  return (
    <div className="flex flex-col gap-8">
      <TopBarMobile />
      <div className="flex w-full h-full xl:justify-center">
        <div className="flex w-full justify-center lg:justify-between items-center lg:px-7">
          {/* Titre et sous-titre */}
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
      <ComicsFilter />
    </div>
  );
}
