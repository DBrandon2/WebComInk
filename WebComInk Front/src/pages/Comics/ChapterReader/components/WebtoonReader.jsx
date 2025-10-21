import React, { useContext } from "react";
import { ChapterReaderContext } from "../context/ChapterReaderContext";
import { API_BASE_URL } from "../utils/constants";
import { buildProxiedImageUrl } from "../utils/readerUtils";

export default function WebtoonReader({ readerMargin }) {
  const {
    chapterImages,
    imageLoadingStates,
    handleImageLoad,
    handleImageError,
  } = useContext(ChapterReaderContext);

  if (chapterImages.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        Aucune image trouvée pour ce chapitre.
      </div>
    );
  }

  const marginValue = (readerMargin / 100) * 70;

  return (
    <div className="px-0 lg:px-32 xl:px-56 2xl:px-80">
      {chapterImages.map((imageUrl, index) => {
        const proxiedUrl = buildProxiedImageUrl(API_BASE_URL, imageUrl);

        return (
          <div
            key={index}
            className="relative w-full flex items-start justify-center"
          >
            <img
              src={proxiedUrl}
              onLoad={() => handleImageLoad(index)}
              onError={(e) => {
                handleImageError(index);
                e.target.src = "/default-placeholder.png";
              }}
              alt={`Page ${index + 1}`}
              draggable="false"
              loading="lazy"
              decoding="async"
              style={{
                maxWidth: "100vw",
                width: `${100 - marginValue}%`,
                marginLeft: `${marginValue / 2}%`,
                marginRight: `${marginValue / 2}%`,
              }}
            />
            {imageLoadingStates[index] && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
