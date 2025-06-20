import React from "react";
import image1 from "../../assets/MangaCover/kaiju cover.webp";
import image2 from "../../assets/MangaCover/OP manga cover.jpg";
import image3 from "../../assets/MangaCover/Vinland-Saga-28.webp";
import image4 from "../../assets/MangaCover/Sakamoto Cover.webp";
import ButtonAnimated from "../../components/ButtonAnimated";
import { NavLink } from "react-router-dom";
import banner from "../../assets/MangaCover/614cfc33-1ba5-44df-9a85-c1cb2d7f1e00.webp";

const imageBanner =
  "https://res.cloudinary.com/drib6vkyw/image/upload/v1749214624/Dandadan-Banner_wivgsj.webp";

export default function MostPopular() {
  const comicsItems = [
    {
      title:
        "Kaiju n°8 Kaiju n°8 Kaiju n°8 Kaiju n°8 Kaiju n°8 Kaiju n°8 Kaiju n°8",
      author: "Eiichiro Oda",
      image: image1,
    },
    {
      title: "One Piece ",
      author: "Eiichiro Oda",
      image: image2,
    },
    {
      title: "Vinland Saga",
      author: "Eiichiro Oda",
      image: image3,
    },
    {
      title: "Sakamoto Days",
      author: "Eiichiro Oda",
      image: image4,
    },
    {
      title: "Kaiju n°8",
      author: "Eiichiro Oda",
      image: image1,
    },
    {
      title: "One Piece",
      author: "Eiichiro Oda",
      image: image2,
    },
    {
      title: "Vinland Saga",
      author: "Eiichiro Oda",
      image: image3,
    },
    {
      title: "Sakamoto Days",
      author: "Eiichiro Oda",
      image: image4,
    },
    {
      title: "Kaiju n°8",
      author: "Eiichiro Oda",
      image: image1,
    },
  ];

  const ComicsBanner = {
    title: "Dandadan",
    img: imageBanner,
  };

  return (
    <div className="flex flex-col items-center justify-center gap-y-6 lg:gap-y-12 px-3 w-full overflow-x-hidden">
      {/* Titre et sous titre */}
      <div className="flex w-full h-full xl:justify-center">
        <div className="flex w-full justify-center lg:justify-between items-center lg:px-7">
          <div className="flex flex-col">
            <h1 className="text-3xl text-accent text-center lg:text-start font-medium tracking-wider lg:text-4xl">
              Les plus populaires
            </h1>
            <h2 className="text-center lg:text-start font-light">
              Découvre ici les œuvres les plus populaires de la platforme !
            </h2>
          </div>
          <NavLink to="/comics" className="hidden lg:flex">
            <ButtonAnimated text="Decouvrir plus" />
          </NavLink>
        </div>
      </div>

      <div className="flex flex-col items-center gap-y-4 lg:gap-y-12 w-full">
        {/* Banner */}
        <div className="relative flex flex-col gap-2 mb-2 w-full lg:w-[90%] xl:w-[80%] h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[800px]">
          <img
            src={ComicsBanner.img}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-gradient-to-t from-dark-bg to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 pb-4 flex justify-center items-end">
            <h3 className="font-medium text-center text-accent text-xl md:2xl lg:text-3xl tracking-wide xl:tracking-widest xl:text-4xl">
              {ComicsBanner.title}
            </h3>
          </div>
        </div>

        {/* Liste des mangas */}
        <div className="grid grid-cols-3 gap-x-2 gap-y-6 w-full max-w-full lg:flex lg:flex-wrap 2xl:w-[90%] xl:gap-x-12 lg:justify-center ">
          {comicsItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="w-[100px] h-[150px] lg:w-[240px] lg:h-[360px] bg-gray-200 flex items-center justify-center">
                <img
                  className="w-full h-full object-cover cursor-pointer"
                  src={item.image}
                  alt="Manga Cover"
                />
              </div>
              <div className="flex flex-col justify-center items-center w-[110px] lg:w-[250px]">
                <h3 className="font-medium text-accent text-center line-clamp-2 text-sm tracking-wide lg:text-lg">
                  {item.title}
                </h3>
                <span className="text-sm font-light text-gray-200 lg:text-base">
                  {item.author}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <NavLink to="/comics" className="lg:hidden">
        <ButtonAnimated text={"Parcourir plus"} />
      </NavLink>
    </div>
  );
}
