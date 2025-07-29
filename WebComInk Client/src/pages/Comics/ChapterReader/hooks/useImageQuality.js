import { useState, useEffect } from 'react';
import { IMAGE_QUALITY } from '../utils/constants';

export const useImageQuality = () => {
  const [imageQuality, setImageQuality] = useState(IMAGE_QUALITY.DATA);
  const [connectionSpeed, setConnectionSpeed] = useState('fast');
  const [userPreference, setUserPreference] = useState(null);

  // Détecter la vitesse de connexion
  useEffect(() => {
    const detectConnectionSpeed = async () => {
      try {
        // Test simple de vitesse de connexion
        const startTime = performance.now();
        const response = await fetch('/api/ping', { 
          method: 'HEAD',
          cache: 'no-cache'
        });
        const endTime = performance.now();
        
        const responseTime = endTime - startTime;
        
        if (responseTime < 100) {
          setConnectionSpeed('fast');
        } else if (responseTime < 500) {
          setConnectionSpeed('medium');
        } else {
          setConnectionSpeed('slow');
        }
      } catch (error) {
        // En cas d'erreur, on suppose une connexion moyenne
        setConnectionSpeed('medium');
      }
    };

    detectConnectionSpeed();
  }, []);

  // Charger la préférence utilisateur
  useEffect(() => {
    const storedPreference = localStorage.getItem('imageQuality');
    if (storedPreference && Object.values(IMAGE_QUALITY).includes(storedPreference)) {
      setUserPreference(storedPreference);
    }
  }, []);

  // Déterminer la qualité optimale
  const getOptimalQuality = () => {
    // Si l'utilisateur a une préférence, l'utiliser
    if (userPreference) {
      return userPreference;
    }

    // Sinon, adapter selon la connexion
    switch (connectionSpeed) {
      case 'fast':
        return IMAGE_QUALITY.DATA;
      case 'medium':
        return IMAGE_QUALITY.DATA;
      case 'slow':
        return IMAGE_QUALITY.DATA_SAVER;
      default:
        return IMAGE_QUALITY.DATA;
    }
  };

  // Mettre à jour la qualité
  useEffect(() => {
    const optimalQuality = getOptimalQuality();
    setImageQuality(optimalQuality);
  }, [connectionSpeed, userPreference]);

  // Sauvegarder la préférence utilisateur
  const setUserQualityPreference = (quality) => {
    setUserPreference(quality);
    localStorage.setItem('imageQuality', quality);
    setImageQuality(quality);
  };

  // Obtenir l'URL optimisée pour une image
  const getOptimizedImageUrl = (baseUrl, hash, filename) => {
    const qualityPath = imageQuality === IMAGE_QUALITY.DATA_SAVER ? 'data-saver' : 'data';
    return `${baseUrl}/${qualityPath}/${hash}/${filename}`;
  };

  return {
    imageQuality,
    connectionSpeed,
    userPreference,
    setUserQualityPreference,
    getOptimizedImageUrl,
    isHighQuality: imageQuality === IMAGE_QUALITY.DATA,
    isLowQuality: imageQuality === IMAGE_QUALITY.DATA_SAVER,
  };
}; 