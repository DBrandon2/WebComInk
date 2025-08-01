import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import LibraryMangaCard from "./LibraryMangaCard";
import { slugify } from "../../utils/mangaUtils";

export default function SortableMangaCard({
  manga,
  index,
  onRemove,
  onChangeCategory,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: manga.mangaId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    touchAction: isDragging ? "none" : "pan-y", // Désactive le scroll uniquement pendant le drag
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`library-grid-item min-h-[180px] min-w-[120px] sm:min-h-[220px] sm:min-w-[150px] md:min-h-[250px] md:min-w-[180px] ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }${isDragging ? " is-dragging" : ""}`}
    >
      <LibraryMangaCard
        id={manga.mangaId}
        title={manga.title}
        coverUrl={manga.coverImage}
        to={`/Comics/${manga.mangaId}/${slugify(manga.title)}`}
        onRemove={onRemove}
        onChangeCategory={onChangeCategory}
        isDragging={isDragging}
        dragOverlay={false}
      />
    </div>
  );
}
