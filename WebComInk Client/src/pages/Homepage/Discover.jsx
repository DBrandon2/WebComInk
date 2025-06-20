import React from "react";
import ButtonAnimated from "../../components/ButtonAnimated";
import image from "../../assets/MangaCover/OMRWP Cover.jpg";
import { NavLink } from "react-router-dom";

export default function Discover() {
  const dailyComics = {
    title: "Omniscient Reader Viewpoint",
    author: "UMI",
    illustrator: "Sleepy-C",
    genre: ["Action", "Adventure", "Fantasy"],
    description: `Back then, Dok-Ja had no idea. He had no idea his favorite web novel 'Three Ways to Survive the Apocalypse' was going to come to life,
      and that he would become the only person to know how the world was going to end.
       He also had no idea he would end up becoming the protagonist of this novel-turned-reality. Now, Dok-Ja will go on a journey to change the course
        of the story and save humankind once and for all.`,
    status: "En cours",
    image: image,
    chapter: "252",
  };
  
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-6 mx-3 lg:gap-y-12">
      <div className="flex w-full h-full xl:justify-center ">
        <div className="flex w-full justify-center lg:justify-between items-center lg:px-7 ">
          {/* Titre et sous-titre */}
          <div className="flex flex-col">
            <h1 className="text-3xl text-accent text-center lg:text-start font-medium tracking-wider lg:text-4xl">
              Découverte du jour
            </h1>
            <h2 className="text-center lg:text-start font-light">
              Découvre tout les jours une nouvelle oeuvre !
            </h2>
          </div>
          <NavLink to="/comics" className="hidden lg:flex">
            <ButtonAnimated text="Decouvrir plus" />
          </NavLink>
        </div>
      </div>

      <div className="lg:flex lg:justify-center lg:gap-8 xl:gap-24">
        {/* Image */}
        <div className="flex justify-center lg:bg-red-300 lg:w-[500px] lg:h-[700px]">
          <img
            src={dailyComics.image}
            alt=""
            className="lg:w-full lg:h-full object-cover"
          />
        </div>
        {/* Infos */}
        <div className="flex justify-start items-center text-center lg:text-start w-full flex-col gap-3 lg:w-[40%] mt-4">
          <h2 className="font-bold text-xl text-accent text-center lg:text-3xl lg:tracking-wider lg:w-full lg:text-start lg:mb-8">
            {dailyComics.title}
          </h2>
          <div className="flex w-full justify-center lg:justify-start">
            <p>
              <span className="font-semibold">Auteur :</span>{" "}
              {dailyComics.author}
            </p>
          </div>
          <div className="flex w-full justify-center lg:justify-start">
            <p>
              <span className="font-semibold">Artiste :</span>{" "}
              {dailyComics.illustrator}
            </p>
          </div>
          <div className="flex w-full justify-center lg:justify-start gap-1">
            <span className="font-semibold">Genre : </span>
            <div className="flex gap-2">
              {dailyComics.genre.map((genre) => (
                <span key={genre}>{genre}</span>
              ))}
            </div>
          </div>
          <div className="flex w-full justify-center lg:justify-start">
            <p>
              <span className="font-semibold">Status :</span>{" "}
              {dailyComics.status}
            </p>
          </div>
          <div className="flex w-full justify-center lg:justify-start">
            <p>
              <span className="font-semibold">Nombre de chapitre :</span>{" "}
              {dailyComics.chapter}
            </p>
          </div>
          <div className="flex flex-col justify-center items-center w-full gap-2 mt-4">
            <span className="w-[90%] h-[1px] bg-accent"></span>
            <p className="description text-gray-200 text-center lg:text-start">
              {dailyComics.description}
            </p>
            <span className="w-[90%] h-[1px] mt-3 bg-accent"></span>
          </div>
        </div>
      </div>
      <div className="lg:hidden">
        <ButtonAnimated text={["En savoir plus"]} justify="justify-end" />
      </div>
    </div>
  );
}
