import React from "react";
import image1 from "../../assets/MangaCover/kaiju cover.webp";
import image2 from "../../assets/MangaCover/OP manga cover.jpg";
import image3 from "../../assets/MangaCover/vinland-Saga-28.webp";
import image4 from "../../assets/MangaCover/Sakamoto Cover.webp";
import ButtonAnimated from "../../components/ButtonAnimated";
import { IoIosArrowDown } from "react-icons/io";

export default function LatestRelease() {
  const comicsItems = [
    {
      title:
        "Kaiju n°8 Kaiju n°8 Kaiju n°8 Kaiju n°8 Kaiju n°8 Kaiju n°8 Kaiju n°8",
      chapter: "152",
      image: image1,
    },
    {
      title: "One Piece",
      chapter: "1112",
      image: image2,
    },
    {
      title: "Vinland Saga",
      chapter: "52",
      image: image3,
    },
    {
      title: "Sakamoto Days",
      chapter: "102",
      image: image4,
    },
    {
      title: "Kaiju n°8",
      chapter: "152",
      image: image1,
    },
    {
      title: "One Piece",
      chapter: "1522",
      image: image2,
    },
    {
      title: "Vinland Saga",
      chapter: "112",
      image: image3,
    },
    {
      title: "Sakamoto Days",
      chapter: "102",
      image: image4,
    },
    {
      title: "Kaiju n°8",
      chapter: "152",
      image: image1,
    },
    {
      title: "One Piece",
      chapter: "1542",
      image: image2,
    },
    {
      title: "Vinland Saga",
      chapter: "112",
      image: image3,
    },
    {
      title: "Sakamoto Days",
      chapter: "152",
      image: image4,
    },
    {
      title: "Kaiju n°8",
      chapter: "152",
      image: image1,
    },
  ];

  const getTitleFontSize = (title) => {
    if (title.length > 30) {
      return "text-sm"; // Petite taille pour les titres longs
    }
    return "text-base"; // Taille normale pour les titres courts
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 mx-3">
      <div className="flex flex-col w-full justify-center items-center">
        <h1 className="text-3xl text-accent font-medium tracking-wider">
          Les dernières sorties
        </h1>
        <h2 className="text font-light">
          Découvre les sorties des derniers chapitres
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-x-2 gap-y-4">
        {comicsItems.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div className="w-[160px] h-[240px] bg-gray-200 flex items-center justify-center">
              <img
                className="w-full h-full object-cover"
                src={item.image}
                alt="Manga Cover"
              />
            </div>
            <div className="flex flex-col justify-center items-center w-[180px]">
              <h3
                className={`font-medium text-accent text-center line-clamp-2 ${getTitleFontSize(
                  item.title
                )}`}
              >
                {item.title}
              </h3>
              <p className="font-light">Chapitre : {item.chapter}</p>
            </div>
          </div>
        ))}
      </div>
      <ButtonAnimated
        text={["Afficher plus", <IoIosArrowDown />]}
        justify="justify-center"
      />
    </div>
  );
}
