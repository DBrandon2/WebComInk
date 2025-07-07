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
      className={`library-grid-item${isDragging ? " is-dragging" : ""}`}
    >
      <LibraryMangaCard
        id={manga.mangaId}
        title={manga.title}
        coverUrl={manga.coverImage}
        authorName={manga.author}
        artistName={manga.artist}
        to={`/Comics/${manga.mangaId}/${slugify(manga.title)}`}
        onRemove={onRemove}
        onChangeCategory={onChangeCategory}
        isDragging={isDragging}
        dragOverlay={false}
      />
    </div>
  );
}
