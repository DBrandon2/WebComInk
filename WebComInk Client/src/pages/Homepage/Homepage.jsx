import React from "react";
import Carousel from "../../components/Carousel";
import LatestRelease from "./LatestRelease";
import MostPopular from "./MostPopular";
import Discover from "./Discover";

export default function Homepage() {
  return (
    <main
      id="main-content"
      role="main"
      className="w-full h-full flex flex-col gap-18 lg:gap-32 mb-32"
    >
      {/* Titre principal masqué pour l'accessibilité/SEO */}
      <h1 className="sr-only">Accueil — WebComInk</h1>

      {/* Sections de la page d'accueil */}
      <Carousel />
      <LatestRelease />
      <MostPopular />
      <Discover />
    </main>
  );
}
