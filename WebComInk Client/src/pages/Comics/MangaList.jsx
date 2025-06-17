import React, { useEffect, useState, useCallback, useRef } from "react";
import { getMangas } from "../../services/mangaService";
import ButtonAnimated from "../../components/ButtonAnimated";

const BATCH_SIZE = 18;
const LIMIT_STEP = 300; // plafond total max, pour arrêter l'auto-load

export function enrichMangas(mangas) {
  return mangas.map((manga) => {
    const title =
      manga.attributes.title?.fr ||
      manga.attributes.title?.en ||
      "Titre non disponible";

    const relationships = manga.relationships || [];

    const coverRel = relationships.find((rel) => rel.type === "cover_art");
    const coverFileName = coverRel?.attributes?.fileName;

    const coverUrl = coverFileName
      ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFileName}.256.jpg`
      : "/default-cover.png";

    const authors = relationships
      .filter((rel) => rel.type === "author")
      .map((rel) => rel.attributes?.name)
      .filter(Boolean);

    const artists = relationships
      .filter((rel) => rel.type === "artist")
      .map((rel) => rel.attributes?.name)
      .filter(Boolean);

    return {
      id: manga.id,
      title,
      coverUrl,
      authorName:
        authors.length > 0 ? [...new Set(authors)].join(", ") : "Inconnu",
      artistName:
        artists.length > 0 ? [...new Set(artists)].join(", ") : "Inconnu",
    };
  });
}

export default function MangaList() {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoLoadFinished, setAutoLoadFinished] = useState(false);

  const offsetRef = useRef(0);
  const observerRef = useRef();

  const loadMangas = useCallback(async () => {
    if (loading || autoLoadFinished) return;
    setLoading(true);

    try {
      // ⚠️ IMPORTANT : appel corrigé, on passe un objet en paramètre
      const data = await getMangas({
        limit: BATCH_SIZE,
        lang: "fr",
        offset: offsetRef.current,
        includes: ["author", "artist", "cover_art"],
      });

      console.log("[fetch complet]", data);

      const mangasWithDetails = enrichMangas(data.data);

      if (mangasWithDetails.length === 0) {
        setAutoLoadFinished(true);
        setLoading(false);
        return;
      }

      setMangas((prevMangas) => {
        const prevIds = new Set(prevMangas.map((m) => m.id));
        const filteredNew = mangasWithDetails.filter((m) => !prevIds.has(m.id));
        const combined = [...prevMangas, ...filteredNew];

        console.log(
          `[fetch résumé] offset: ${offsetRef.current}, reçus: ${mangasWithDetails.length}, total en state: ${combined.length}`
        );

        return combined;
      });

      offsetRef.current += mangasWithDetails.length;

      if (
        offsetRef.current >= LIMIT_STEP ||
        mangasWithDetails.length < BATCH_SIZE
      ) {
        setAutoLoadFinished(true);
      }
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des mangas");
    } finally {
      setLoading(false);
    }
  }, [loading, autoLoadFinished]);

  useEffect(() => {
    if (autoLoadFinished) return;

    let throttleTimeout = null;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !throttleTimeout) {
          loadMangas();
          throttleTimeout = setTimeout(() => {
            throttleTimeout = null;
          }, 500);
        }
      },
      { rootMargin: "300px" }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
      if (throttleTimeout) clearTimeout(throttleTimeout);
    };
  }, [loadMangas, loading, autoLoadFinished]);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="grid grid-cols-3 gap-x-2 gap-y-6 w-full max-w-full lg:flex lg:flex-wrap 2xl:w-[70%] xl:gap-x-12 lg:justify-center">
        {mangas.map((manga) => (
          <div key={manga.id} className="flex flex-col items-center gap-2">
            <div className="w-[100px] h-[150px] lg:w-[240px] lg:h-[360px] bg-gray-200 flex items-center justify-center">
              <img
                src={manga.coverUrl || "/default-cover.png"}
                alt={`${manga.title} cover`}
                className="w-full h-full object-cover cursor-pointer"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-cover.png";
                }}
              />
            </div>
            <div className="flex flex-col justify-center items-center w-[100%] lg:w-[250px]">
              <h3 className="font-medium text-accent text-center line-clamp-2 text-sm tracking-wide lg:text-lg">
                {manga.title}
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
        ))}
      </div>

      {loading && (
        <p className="text-center my-4 font-medium text-gray-600">
          Chargement...
        </p>
      )}

      {/* Div "trigger" pour l'observer */}
      <div ref={observerRef} style={{ height: 1 }} />

      {autoLoadFinished && (
        <div className="text-center mt-6">
          <ButtonAnimated
            text={"Afficher plus"}
            justify={"justify-center"}
            onClick={() => {
              setAutoLoadFinished(false);
              loadMangas();
            }}
            disabled={loading}
          />
        </div>
      )}
    </div>
  );
}
