import React, { useEffect, useState, useRef } from "react";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const BAR_HEIGHT = 48; // px

export default function TopBarMobile() {
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0); // px
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      let newOffset = offset;
      if (currentY > lastScrollY.current) {
        // Scroll down : augmente l'offset jusqu'à BAR_HEIGHT
        newOffset = Math.min(BAR_HEIGHT, offset + (currentY - lastScrollY.current));
      } else {
        // Scroll up : diminue l'offset jusqu'à 0
        newOffset = Math.max(0, offset - (lastScrollY.current - currentY));
      }
      setOffset(newOffset);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line
  }, [offset]);

  const handleBack = () => {
    navigate("/Comics");
  };

  return (
    <div
      className={
        "fixed top-0 left-0 w-full z-30 flex justify-between items-center px-3 py-2  lg:hidden transition-transform duration-200"
      }
      style={{
        minHeight: `${BAR_HEIGHT}px`,
        maxHeight: `${BAR_HEIGHT}px`,
        transform: `translateY(-${offset}px)`
      }}
    >
      <button
        className="p-1 rounded-full hover:bg-accent/20 transition"
        onClick={handleBack}
        aria-label="Retour"
      >
        <MdOutlineArrowBackIos className="text-2xl" />
      </button>
      <button
        className="p-1 rounded-full hover:bg-accent/20 transition"
        aria-label="Recherche"
      >
        <FaMagnifyingGlass className="text-2xl" />
      </button>
    </div>
  );
}
