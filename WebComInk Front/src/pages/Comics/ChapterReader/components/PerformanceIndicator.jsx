import React, { useState, useEffect } from 'react';

export default function PerformanceIndicator({
  cacheSize,
  cachedChaptersCount,
  cachedImagesCount,
  connectionSpeed,
  imageQuality,
  isVisible = false,
}) {
  const [showDetails, setShowDetails] = useState(false);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getConnectionSpeedColor = () => {
    switch (connectionSpeed) {
      case 'fast':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'slow':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getQualityColor = () => {
    return imageQuality === 'data' ? 'text-green-400' : 'text-blue-400';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-dark-bg/90 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-white text-sm font-medium">Performance</span>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {showDetails ? '−' : '+'}
          </button>
        </div>
        
        <div className="text-xs text-gray-300 space-y-1">
          <div className="flex justify-between">
            <span>Cache:</span>
            <span className="text-white">{formatBytes(cacheSize)}</span>
          </div>
          <div className="flex justify-between">
            <span>Chapitres:</span>
            <span className="text-white">{cachedChaptersCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Images:</span>
            <span className="text-white">{cachedImagesCount}</span>
          </div>
        </div>

        {showDetails && (
          <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-300 space-y-1">
            <div className="flex justify-between">
              <span>Connexion:</span>
              <span className={getConnectionSpeedColor()}>
                {connectionSpeed === 'fast' ? 'Rapide' : 
                 connectionSpeed === 'medium' ? 'Moyenne' : 'Lente'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Qualité:</span>
              <span className={getQualityColor()}>
                {imageQuality === 'data' ? 'Haute' : 'Optimisée'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 