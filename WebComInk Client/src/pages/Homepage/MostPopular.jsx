import React from "react";
import image1 from "../../assets/MangaCover/kaiju cover.webp";
import image2 from "../../assets/MangaCover/OP manga cover.jpg";
import image3 from "../../assets/MangaCover/vinland-Saga-28.webp";
import image4 from "../../assets/MangaCover/Sakamoto Cover.webp";
import ButtonAnimated from "../../components/ButtonAnimated";
import { IoIosArrowDown } from "react-icons/io";
import imageBanner from "../../assets/MangaCover/Banner/Dandadan Banner.png";

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
        <div className="flex flex-col gap-2 mb-2">
          <img src={ComicsBanner.img} alt="" />
          <h3 className="font-medium text-accent text-center">
            {ComicsBanner.title}
          </h3>
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
                <span className="text-sm font-light text-gray-200">{item.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ButtonAnimated text={"Parcourir plus"} />
    </div>
  );
}
