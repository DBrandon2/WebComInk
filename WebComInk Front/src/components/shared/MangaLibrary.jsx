import React, { useState } from "react";
import { Reorder } from "framer-motion";
import LibraryMangaCard from "./LibraryMangaCard";

export default function MangaLibrary({ initialMangas }) {
  const [mangaList, setMangaList] = useState(initialMangas);

  const handleReorder = (newOrder) => {
    setMangaList(newOrder);
    // Tu peux aussi appeler une API ici pour sauvegarder l'ordre
    // saveOrderToBackend(newOrder);
  };

  return (
    <Reorder.Group
      axis="y"
      values={mangaList}
      onReorder={handleReorder}
      className="flex flex-col gap-4 w-full"
    >
      {mangaList.map((manga) => (
        <Reorder.Item
          key={manga.id}
          value={manga}
          className="w-full bg-white rounded-lg shadow-md"
          style={{ minHeight: 120 }}
        >
          <div className="w-full">
            <LibraryMangaCard
              {...manga}
              // autres props
            />
          </div>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
} 