import React, { useEffect, useState, useCallback } from "react";
import { getMangas } from "../../services/mangaService";

const BATCH_SIZE = 18;

export default function MangaList() {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);

  const loadMangas = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    try {
      console.log("Chargement mangas à partir de l'offset :", offset);
      const data = await getMangas(BATCH_SIZE, "fr", offset);
      const mangasData = data.data;

      const mangasWithDetails = mangasData.map((manga) => {
        const title =
          manga.attributes.title.fr ||
          manga.attributes.title.en ||
          "Titre non dispo";

        const relationships = manga.relationships || [];

        const coverRel = relationships.find((rel) => rel.type === "cover_art");
        const coverUrl = coverRel
          ? `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}.256.jpg`
          : null;

        const authors = relationships
          .filter((rel) => rel.type === "author")
          .map((rel) => rel.attributes?.name || "Inconnu");

        const artists = relationships
          .filter((rel) => rel.type === "artist")
          .map((rel) => rel.attributes?.name || "Inconnu");

        return {
          ...manga,
          coverUrl,
          authorName: [...new Set(authors)].join(", ") || "Inconnu",
          artistName: [...new Set(artists)].join(", ") || "Inconnu",
        };
      });

      setMangas((prev) => {
        const combined = [...prev, ...mangasWithDetails];
        const uniqueMangas = Array.from(
          new Map(combined.map((m) => [m.id, m])).values()
        );
        return uniqueMangas;
      });

      setOffset((prev) => prev + BATCH_SIZE);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les mangas");
    } finally {
      setLoading(false);
    }
  }, [offset, loading]);

  useEffect(() => {
    loadMangas();
  }, []); // premier chargement

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight || document.documentElement.clientHeight;

      // Précharge quand on est à moins de 700px du bas de la page
      if (scrollTop + clientHeight >= scrollHeight - 700 && !loading) {
        loadMangas();
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [loadMangas, loading]);

  if (error) return <p>{error}</p>;

  return (
    <div
      className="grid grid-cols-3 gap-x-2 gap-y-6 w-full max-w-full lg:flex lg:flex-wrap 2xl:w-[70%] xl:gap-x-12 lg:justify-center"
    >
      {mangas.map((manga) => {
        const title =
          manga.attributes.title.fr ||
          manga.attributes.title.en ||
          "Titre non dispo";

        return (
          <div key={manga.id} className="flex flex-col items-center gap-2">
            <div className="w-[100px] h-[150px] lg:w-[240px] lg:h-[360px] bg-gray-200 flex items-center justify-center">
              {manga.coverUrl ? (
                <img
                  src={manga.coverUrl}
                  alt={`${title} cover`}
                  className="w-full h-full object-cover cursor-pointer"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-cover.png";
                  }}
                />
              ) : (
                <p>Pas d'image disponible</p>
              )}
            </div>
            <div className="flex flex-col justify-center items-center w-[110px] lg:w-[250px]">
              <h3 className="font-medium text-accent text-center line-clamp-2 text-sm tracking-wide lg:text-lg">
                {title}
              </h3>
              <span className="text-xs text-gray-400 lg:text-sm text-center line-clamp-2 w-full">
                Auteur : {manga.authorName}
              </span>
              {manga.artistName !== manga.authorName && (
                <span className="text-xs text-gray-400 lg:text-sm text-center line-clamp-2 w-full">
                  Artiste : {manga.artistName}
                </span>
              )}
            </div>
          </div>
        );
      })}
      {loading && <p>Chargement...</p>}
    </div>
  );
}
