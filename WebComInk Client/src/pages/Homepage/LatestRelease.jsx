import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import image1 from "../../assets/MangaCover/kaiju cover.webp";
import image2 from "../../assets/MangaCover/OP manga cover.jpg";
import image3 from "../../assets/MangaCover/Vinland-Saga-28.webp";
import image4 from "../../assets/MangaCover/Sakamoto Cover.webp";
import ButtonAnimated from "../../components/ButtonAnimated";
import { IoIosArrowDown } from "react-icons/io";
import { NavLink } from "react-router-dom";

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
  ];

  const [visibleCount, setVisibleCount] = useState(10);

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 20);
  };

  const getTitleFontSize = (title) => {
    if (title.length > 30) {
      return "text-sm";
    }
    return "text-base";
  };

  const carouselRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        setContainerWidth(carouselRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", updateWidth);
    updateWidth();

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const itemWidth = 240;
  const itemSpacing = 16;
  const totalWidth =
    comicsItems.length * (itemWidth + itemSpacing) - itemSpacing;

  return (
    <div className="flex flex-col items-center justify-center gap-8 mx-3 lg:my-8 lg:gap-y-12">
      <div className="flex w-full h-full">
        <div className="flex w-full justify-center lg:justify-between items-center lg:px-7">
          <div className="flex flex-col">
            <h1 className="text-3xl text-accent font-medium tracking-wider lg:text-4xl">
              Les dernières sorties
            </h1>
            <h2 className="text-center lg:text-start font-light">
              Découvre les sorties des derniers chapitres
            </h2>
          </div>
          <NavLink to="/comics" className="hidden lg:flex">
            <ButtonAnimated text="Voir les comics" />
          </NavLink>
        </div>
      </div>

      <div className="lg:hidden grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-4">
        {comicsItems.slice(0, visibleCount).map((item, index) => (
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

      {/* Desktop */}
      <div className="hidden lg:block relative w-full overflow-hidden px-6 my-2">
        <div className="absolute top-0 left-0 h-full w-24 z-10 pointer-events-none bg-gradient-to-r from-dark-bg via-dark-bg/70 to-transparent" />

        <div className="absolute top-0 right-0 h-full w-24 z-10 pointer-events-none bg-gradient-to-l from-dark-bg via-dark-bg/70 to-transparent" />

        <motion.div
          ref={carouselRef}
          className="flex space-x-4"
          drag="x"
          dragConstraints={{
            right: 0,
            left: Math.min(0, -(totalWidth - containerWidth + 48 * 2)),
          }}
          whileTap={{ cursor: "grabbing" }}
        >
          {comicsItems.map((item, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center gap-2"
              style={{ minWidth: `${itemWidth}px` }}
            >
              <div className="w-[240px] h-[360px] bg-gray-200 flex items-center justify-center">
                <img
                  className="w-full h-full object-cover cursor-pointer "
                  src={item.image}
                  alt="Manga Cover"
                  draggable={false}
                />
              </div>
              <div className="flex flex-col justify-center items-center w-[240px]">
                <h3 className="font-medium text-accent text-center line-clamp-2 text-lg tracking-wide">
                  {item.title}
                </h3>
                <p className="">Chapitre : {item.chapter}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/*  */}
      <div className="lg:hidden">
        {visibleCount < comicsItems.length && (
          <ButtonAnimated
            text={[
              <span key="text">Afficher plus</span>,
              <IoIosArrowDown key="icon" />,
            ]}
            justify="justify-center"
            onClick={handleShowMore}
          />
        )}
      </div>
    </div>
  );
}
