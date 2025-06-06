import React from "react";
import ButtonAnimated from "../../components/ButtonAnimated";
import image from "../../assets/MangaCover/OMRWP Cover.jpg";

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
    <div className="flex flex-col items-center justify-center gap-4 mx-3">
      <div className="flex flex-col w-full justify-center items-center">
        <h1 className="text-3xl text-accent font-medium tracking-wider">
          Découverte
        </h1>
        <h2 className="text font-light">
          Découvre tout les jours une nouvelle oeuvre
        </h2>
      </div>

      <div>
        <img src={dailyComics.image} alt="" />
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="font-bold text-xl text-accent">{dailyComics.title}</h2>
        <div className="flex w-full">
          <p>
            {" "}
            <span className="font-semibold">Auteur :</span> {dailyComics.author}
          </p>
        </div>
        <div className="flex w-full">
          <p>
            {" "}
            <span className="font-semibold">Artiste :</span>{" "}
            {dailyComics.illustrator}
          </p>
        </div>
        <div className="flex w-full gap-1">
          <span className="font-semibold">Genre : </span>
          <div className="flex gap-2">
            {dailyComics.genre.map((genre) => (
              <span key={genre}>{genre}</span>
            ))}
          </div>
        </div>
        <div className="flex w-full ">
          <p>
            {" "}
            <span className="font-semibold">Status :</span> {dailyComics.status}
          </p>
        </div>
        <div className="flex w-full">
          <p>
            {" "}
            <span className="font-semibold">Nombre de chapitre :</span>{" "}
            {dailyComics.chapter}
          </p>
        </div>
        <div className="flex flex-col justify-center items-center w-full gap-2 mt-4">
          <span className="w-[90%] h-[1px] bg-accent"></span>
          <p className="description text-gray-200">{dailyComics.description}</p>
          <span className="w-[90%] h-[1px] mt-3 bg-accent"></span>
        </div>
      </div>

      <ButtonAnimated text={["En savoir plus"]} justify="justify-end" />
    </div>
  );
}
