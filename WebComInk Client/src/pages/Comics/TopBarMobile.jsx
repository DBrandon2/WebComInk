import React, { useEffect, useState, useRef } from "react";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { motion } from "framer-motion";
import SearchBar from "../../components/shared/SearchBar";
import { AnimatePresence } from "framer-motion";

const BAR_HEIGHT = 48; // px

export default function TopBarMobile() {
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0); // px
  const [showSearch, setShowSearch] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      let newOffset = offset;
      if (currentY > lastScrollY.current) {
        // Scroll down : augmente l'offset jusqu'à BAR_HEIGHT
        newOffset = Math.min(
          BAR_HEIGHT,
          offset + (currentY - lastScrollY.current)
        );
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
        "fixed top-0 left-0 w-full z-30 flex justify-between items-center px-3 py-2 mt-3 lg:hidden transition-transform duration-200"
      }
      style={{
        minHeight: `${BAR_HEIGHT}px`,
        maxHeight: `${BAR_HEIGHT}px`,
        transform: `translateY(-${offset}px)`,
      }}
    >
      <motion.button
        className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.25)] text-white hover:bg-white/20 transition-colors duration-200 flex items-center justify-center"
        whileTap={{ scale: 0.9 }}
        onClick={handleBack}
        aria-label="Retour"
      >
        <MdOutlineArrowBackIos className="text-2xl mr-1" />
      </motion.button>
      <motion.button
        className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.25)] text-[32px] text-white hover:bg-white/20 transition-colors duration-200 flex items-center justify-center"
        whileTap={{ scale: 0.9 }}
        aria-label="Recherche"
        onClick={() => setShowSearch(true)}
      >
        <HiOutlineMagnifyingGlass />
      </motion.button>
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center"
            style={{ paddingTop: 56 }}
          >
            <div className="w-full max-w-lg mx-auto">
              <SearchBar
                isMobile={true}
                isOpen={true}
                onClose={() => setShowSearch(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
