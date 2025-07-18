import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function ScrollToTop() {
  const { pathname } = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [forceHide, setForceHide] = useState(false);

  // Scroll automatique au changement de page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Détection du scroll pour afficher/masquer le bouton
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowScrollTop(scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Écouteur d'événement custom pour synchroniser avec ChapterReader
  useEffect(() => {
    const handler = (event) => {
      setForceHide(!event.detail.showHeader);
    };
    window.addEventListener("toggle-scrolltotop", handler);
    return () => window.removeEventListener("toggle-scrolltotop", handler);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Scroll automatique au changement de page (invisible) */}
      <div style={{ display: "none" }} />

      {/* Bouton Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && !forceHide && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-28 right-6 z-50 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/20 shadow-lg rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 text-accent"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Remonter en haut"
          >
            <FaArrowUp size={22} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

export default ScrollToTop;
