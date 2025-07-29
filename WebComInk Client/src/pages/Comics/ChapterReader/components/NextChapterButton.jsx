import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChapterReaderContext } from '../context/ChapterReaderContext';
import { API_BASE_URL } from '../utils/constants';
import { formatChapterTitle } from '../utils/readerUtils';
import logo from '../../../../../assets/logo/chat-mignon-baillant-somnolent-cartoon-vector-icon-illustration-concept-icone-nature-animale-isole-vecteur-premium-style-dessin-anime-plat.png';

export default function NextChapterButton() {
  const navigate = useNavigate();
  const { allChapters, currentChapterIndex, mangaId, slug } = useContext(ChapterReaderContext);
  const [coverImg, setCoverImg] = useState(null);

  // Trouver le prochain chapitre
  const nextChapter = allChapters && currentChapterIndex > 0
    ? allChapters[currentChapterIndex - 1]
    : null;

  useEffect(() => {
    let cancelled = false;
    
    async function fetchCover() {
      if (!nextChapter) return;
      
      try {
        const res = await fetch(`${API_BASE_URL}/proxy/chapter-image/${nextChapter.id}`);
        const data = await res.json();
        
        if (
          data.chapter &&
          data.chapter.data &&
          data.chapter.data.length > 0 &&
          data.chapter.hash &&
          data.baseUrl
        ) {
          const files = data.chapter.data;
          let file = null;
          
          // Essayer de prendre une image du milieu du chapitre
          for (let idx of [4, 3, 2, 1, files.length - 1, 0]) {
            if (files[idx]) {
              file = files[idx];
              break;
            }
          }
          
          if (!file) file = files[0];
          const url = `${data.baseUrl}/data/${data.chapter.hash}/${file}`;
          if (!cancelled) setCoverImg(url);
        } else {
          setCoverImg(null);
        }
      } catch (e) {
        setCoverImg(null);
      }
    }
    
    fetchCover();
    return () => {
      cancelled = true;
    };
  }, [nextChapter]);

  if (!nextChapter) {
    return (
      <div className="flex justify-center mt-8 m-3">
        <div className="bg-gray-800 text-white rounded-md shadow px-3 py-4 max-w-md w-full text-center flex flex-col items-center">
          <div className="font-bold text-base mb-1">Fin de la lecture</div>
          <div className="text-sm text-gray-300 mb-3">
            Il n'y a pas de chapitre suivant disponible pour le moment.
          </div>
          <img
            src={logo}
            alt="Logo WebComInk"
            className="w-16 h-16 mt-2 opacity-80"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-8 m-3">
      <button
        onClick={() => navigate(`/Comics/${mangaId}/${slug}/chapter/${nextChapter.id}`)}
        className="flex items-center gap-2 bg-gray-800 text-white rounded-md shadow px-3 py-2 md:px-3 md:py-3 hover:bg-gray-700 transition text-left max-w-md md:max-w-xl w-full cursor-pointer"
        style={{
          minHeight: 80,
          ...(window.innerWidth >= 768 ? { minHeight: 90 } : {}),
        }}
      >
        {coverImg ? (
          <img
            src={coverImg}
            alt="Prochain chapitre"
            className="w-12 h-16 md:w-16 md:h-20 object-cover rounded shadow"
            style={{ minWidth: window.innerWidth >= 768 ? 64 : 48 }}
          />
        ) : (
          <div className="w-12 h-16 md:w-16 md:h-20 bg-gray-700 rounded flex items-center justify-center text-gray-400 text-2xl">
            ?
          </div>
        )}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-0 md:gap-2 mb-0.5">
            <span className="font-bold text-base md:text-base">
              Chapitre suivant :
            </span>
            <span className="text-accent text-sm md:text-base font-semibold">
              N° {nextChapter.attributes.chapter || "?"}
            </span>
          </div>
          <div className="text-sm md:text-base font-semibold truncate text-accent">
            {nextChapter.attributes.title && (
              <span
                className="text-gray-300 md:text-base"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100%",
                }}
              >
                {formatChapterTitle(nextChapter.attributes.title)}
              </span>
            )}
          </div>
          <div className="text-xs md:text-sm text-gray-400 mt-1">
            Clique pour continuer la lecture !
          </div>
        </div>
      </button>
    </div>
  );
}