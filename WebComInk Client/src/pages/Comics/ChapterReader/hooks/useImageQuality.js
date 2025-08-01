import { useState, useEffect } from "react";
import { IMAGE_QUALITY } from "../utils/constants";

export const useImageQuality = () => {
  const [imageQuality, setImageQuality] = useState(IMAGE_QUALITY.DATA);
  const [userPreference, setUserPreference] = useState(null);

  // Charger la préférence utilisateur
  useEffect(() => {
    const storedPreference = localStorage.getItem("imageQuality");
    if (
      storedPreference &&
      Object.values(IMAGE_QUALITY).includes(storedPreference)
    ) {
      setUserPreference(storedPreference);
      setImageQuality(storedPreference);
    }
  }, []);

  // Sauvegarder la préférence utilisateur
  const setUserQualityPreference = (quality) => {
    setUserPreference(quality);
    localStorage.setItem("imageQuality", quality);
    setImageQuality(quality);
  };

  // Obtenir l'URL optimisée pour une image
  const getOptimizedImageUrl = (baseUrl, hash, filename) => {
    const qualityPath =
      imageQuality === IMAGE_QUALITY.DATA_SAVER ? "data-saver" : "data";
    return `${baseUrl}/${qualityPath}/${hash}/${filename}`;
  };

  return {
    imageQuality,
    userPreference,
    setUserQualityPreference,
    getOptimizedImageUrl,
    isHighQuality: imageQuality === IMAGE_QUALITY.DATA,
    isLowQuality: imageQuality === IMAGE_QUALITY.DATA_SAVER,
  };
};
