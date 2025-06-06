import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import image1 from "../assets/MangaCover/Banner/Innocent banner.png";
import image2 from "../assets/MangaCover/Banner/Chainsaw man banner.png";
import image3 from "../assets/MangaCover/Banner/Frieren Banner.png";
import image4 from "../assets/MangaCover/Banner/Dandadan Banner.png";
import image5 from "../assets/MangaCover/Banner/Naruto Banner.png";

// Tableau contenant les images du carrousel
const images = [image1, image2, image3, image4, image5];

export default function Carousel() {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimation();
  const intervalRef = useRef(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", updateWidth);
    updateWidth();

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        containerRef.current.classList.add("calc-height");
      } else {
        containerRef.current.classList.remove("calc-height");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const resetInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);
  }, []);

  useEffect(() => {
    resetInterval();
    return () => clearInterval(intervalRef.current);
  }, [resetInterval]);

  useEffect(() => {
    controls.start({
      x: -currentIndex * containerWidth,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    });
  }, [currentIndex, containerWidth, controls]);

  const handleDragEnd = (_, info) => {
    const offsetX = info.offset.x;
    let newIndex = currentIndex;

    if (Math.abs(offsetX) > containerWidth / 4) {
      newIndex = offsetX < 0 ? currentIndex + 1 : currentIndex - 1;
    }

    newIndex = Math.max(0, Math.min(images.length - 1, newIndex));

    if (newIndex === currentIndex) {
      controls.start({
        x: -currentIndex * containerWidth,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      });
    } else {
      setCurrentIndex(newIndex);
    }

    resetInterval();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      } else if (event.key === "ArrowLeft") {
        setCurrentIndex(
          (prevIndex) => (prevIndex - 1 + images.length) % images.length
        );
      }
      resetInterval();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resetInterval]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden w-full carousel-3xl-height bg-dark-bg"
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
            className="w-full h-full object-cover flex-shrink-0"
            draggable={false}
            loading="lazy"
          />
        ))}
      </motion.div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 space-x-6 lg:space-x-24">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              resetInterval();
            }}
            className={`w-3 h-3 xl:w-6 xl:h-6 rounded-full  ${
              index === currentIndex ? "bg-accent" : "bg-light-bg"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
