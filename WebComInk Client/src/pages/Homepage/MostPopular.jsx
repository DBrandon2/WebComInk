import React from "react";
import image1 from "../../assets/MangaCover/kaiju cover.webp";
import image2 from "../../assets/MangaCover/OP manga cover.jpg";
import image3 from "../../assets/MangaCover/Vinland-Saga-28.webp";
import image4 from "../../assets/MangaCover/Sakamoto Cover.webp";
import ButtonAnimated from "../../components/ButtonAnimated";
import { NavLink } from "react-router-dom";

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
    <div className="flex flex-col items-center justify-center gap-y-6 px-3 w-full overflow-x-hidden">
      <div className="flex flex-col justify-center items-center ">
        <h1 className="text-3xl text-accent font-medium tracking-wider ">
          Les plus populaires
        </h1>
        <h2 className="text-center">
          Découvre ici les œuvres les plus populaires de la platforme !{" "}
        </h2>
      </div>

      <div className="flex flex-col items-center gap-y-4">
        <div className="relative flex flex-col gap-2 mb-2">
          <img src={ComicsBanner.img} alt="" className="w-full h-auto" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-dark-bg to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 pb-1 flex justify-center items-end">
            <h3 className="font-medium text-center text-accent text-xl tracking-wide">
              {ComicsBanner.title}
            </h3>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-x-2 gap-y-6 w-full max-w-full">
          {comicsItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="w-[100px] h-[150px] bg-gray-200 flex items-center justify-center">
                <img
                  className="w-full h-full object-cover"
                  src={item.image}
                  alt="Manga Cover"
                />
              </div>
              <div className="flex flex-col justify-center items-center w-[110px]">
                <h3 className="font-medium text-accent text-center line-clamp-2 text-sm tracking-wide">
                  {item.title}
                </h3>
                <span className="text-sm font-light text-gray-200">
                  {item.author}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <NavLink to="/comics">
        <ButtonAnimated text={"Parcourir plus"} />
      </NavLink>
    </div>
  );
}
