import React, { useState } from 'react';

const CustomChapterSelect = ({ 
  chapters = [], 
  currentChapter, 
  onChapterSelect, 
  placeholder = "Sélectionner un chapitre" 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChapterClick = (chapter) => {
    onChapterSelect(chapter);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-gray-700 text-white rounded border border-gray-600 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
      >
        <span>
          {currentChapter 
            ? `Chapitre ${currentChapter.attributes?.chapter || '?'}` 
            : placeholder
          }
        </span>
        <span className="float-right">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-gray-700 border border-gray-600 rounded shadow-lg max-h-60 overflow-y-auto">
          {chapters.length === 0 ? (
            <div className="px-4 py-2 text-gray-400">
              Aucun chapitre disponible
            </div>
          ) : (
            chapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => handleChapterClick(chapter)}
                className={`w-full px-4 py-2 text-left hover:bg-gray-600 transition-colors ${
                  currentChapter?.id === chapter.id 
                    ? 'bg-accent text-dark-bg' 
                    : 'text-white'
                }`}
              >
                Chapitre {chapter.attributes?.chapter || '?'}
                {chapter.attributes?.title && (
                  <span className="text-sm opacity-75 ml-2">
                    - {chapter.attributes.title}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      )}
      
      {/* Overlay pour fermer le dropdown quand on clique à l'extérieur */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default CustomChapterSelect;