import React from "react";
import ButtonAnimated from "../../components/ButtonAnimated";
import image from "../../assets/MangaCover/OMRWP Cover.jpg";

export default function Discover() {
  const dailyComics = {
    title: "Omniscient Reader Viewpoint",
    author: "",
    illustrator: "",
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
    <div className="flex flex-col items-center justify-center gap-10 mx-3">
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
      <div className="flex flex-col justify-center items-center gap-2">
        <h2>{dailyComics.title}</h2>
        <p>{dailyComics.author}</p>
        <p>{dailyComics.illustrator}</p>
        {dailyComics.genre.map((genre) => (
          <span key={genre}>{genre}</span>
        ))}
        <p>{dailyComics.status}</p>
        <p>{dailyComics.chapter}</p>
        <p>{dailyComics.description}</p>
      </div>

      <ButtonAnimated text={["Afficher plus"]} justify="justify-center" />
    </div>
  );
}
