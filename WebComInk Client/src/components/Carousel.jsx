import { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import image1 from "../assets/MangaCover/Banner/Innocent banner.png";
import image2 from "../assets/MangaCover/Banner/Chainsaw man banner.png";
import image3 from "../assets/MangaCover/Banner/5265-SeriesHeaders_OP_2000x800_wm.jpg";

// Tableau contenant les images du carrousel
const images = [image1, image2, image3];

export default function Carousel() {
  // Références et états pour gérer le carrousel
  const containerRef = useRef(null); // Référence pour le conteneur du carrousel
  const [containerWidth, setContainerWidth] = useState(0); // État pour la largeur du conteneur
  const [currentIndex, setCurrentIndex] = useState(0); // État pour l'index de l'image actuelle
  const controls = useAnimation(); // Contrôles pour l'animation
  const intervalRef = useRef(null); // Référence pour l'intervalle de défilement automatique

  useEffect(() => {
    // Fonction pour mettre à jour la largeur du conteneur
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    // Ajouter un écouteur d'événement pour le redimensionnement de la fenêtre
    window.addEventListener("resize", updateWidth);
    updateWidth(); // Appel initial pour définir la largeur

    // Nettoyage de l'écouteur d'événement lors du démontage
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Fonction pour réinitialiser l'intervalle de défilement automatique
  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000); // Change l'image toutes les 10 secondes
  };

  useEffect(() => {
    resetInterval(); // Démarrer l'intervalle au montage
    return () => clearInterval(intervalRef.current); // Nettoyage de l'intervalle lors du démontage
  }, []);

  useEffect(() => {
    // Démarrer l'animation pour déplacer le carrousel à l'image actuelle
    controls.start({
      x: -currentIndex * containerWidth,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    });
  }, [currentIndex, containerWidth, controls]);

  // Gestion de la fin du glissement
  const handleDragEnd = (_, info) => {
    const offsetX = info.offset.x; // Décalage horizontal

    let newIndex = currentIndex;

    // Utiliser uniquement la distance pour déterminer le changement d'image
    if (Math.abs(offsetX) > containerWidth / 4) {
      // Ajuster le seuil de distance
      newIndex = offsetX < 0 ? currentIndex + 1 : currentIndex - 1;
    }

    // Limiter l'index entre 0 et le nombre d'images - 1
    newIndex = Math.max(0, Math.min(images.length - 1, newIndex));

    // Si l'index n'a pas changé, recentrer l'image actuelle
    if (newIndex === currentIndex) {
      controls.start({
        x: -currentIndex * containerWidth,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      });
    } else {
      setCurrentIndex(newIndex);
    }

    resetInterval(); // Réinitialiser l'intervalle lorsque l'utilisateur glisse
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden w-full"
      style={{ height: "calc(100vh - 80px)" }}
    >
      <motion.div
        className="flex"
        drag="x"
        onDragEnd={handleDragEnd}
        animate={controls}
        whileTap={{ cursor: "grabbing" }}
      >
        {images.map((src, index) => (
          <motion.img
            key={index}
            src={src}
            alt={`Image ${index + 1}`}
            className="w-screen h-screen  flex-shrink-0 bg-red-300" 
            draggable={false}
          />
        ))}
      </motion.div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 space-x-24 ">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              resetInterval(); // Réinitialiser l'intervalle lorsque l'utilisateur clique sur un point
            }}
            className={`w-6 h-6 rounded-full ${
              index === currentIndex ? "bg-accent" : "bg-light-bg"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
