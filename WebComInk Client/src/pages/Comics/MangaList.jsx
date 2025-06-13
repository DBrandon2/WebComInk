import React, { useEffect, useState, useCallback } from "react";
import { getMangas } from "../../services/mangaService";
import ButtonAnimated from "../../components/ButtonAnimated";

const BATCH_SIZE = 18;
const LIMIT_STEP = 301;

function getSizedFileName(fileName, size) {
  if (fileName.includes(`.${size}.`)) {
    return fileName; // Déjà "sized"
  }
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex === -1) return `${fileName}.${size}`;
  return (
    fileName.substring(0, lastDotIndex) +
    `.${size}` +
    fileName.substring(lastDotIndex)
  );
}

function enrichMangas(mangasData) {
  return mangasData.map((manga) => {
    const title =
      manga.attributes.title?.fr ||
      manga.attributes.title?.en ||
      "Titre non disponible";

    const relationships = manga.relationships || [];

    // Trouve la cover
    const coverRel = relationships.find((rel) => rel.type === "cover_art");
    const coverFileName = coverRel?.attributes?.fileName;

    // Calcule la version 256 de la cover
    const coverFileName256 = coverFileName
      ? getSizedFileName(coverFileName, "256")
      : null;

    // Construction URL vers proxy
    const coverUrl = coverFileName256
      ? `/api/proxy/covers/${manga.id}/${coverFileName256}`
      : "/default-cover.png";

    // Auteurs / artistes
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
        authors.length > 0
          ? [...new Set(authors)].join(", ")
          : "Auteur inconnu",
      artistName:
        artists.length > 0
          ? [...new Set(artists)].join(", ")
          : "Artiste inconnu",
    };
  });
}

export default function MangaList() {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [autoLoadFinished, setAutoLoadFinished] = useState(false);
  const [limit, setLimit] = useState(LIMIT_STEP);

  const loadMangas = useCallback(async () => {
    if (loading) return;
    if (offset >= limit) {
      setAutoLoadFinished(true);
      return;
    }

    setLoading(true);
    try {
      const data = await getMangas(BATCH_SIZE, "fr", offset, [
        "author",
        "artist",
        "cover_art",
      ]);

      const mangasWithDetails = enrichMangas(data.data);

      setMangas((prev) => {
        const combined = [...prev, ...mangasWithDetails];
        const uniqueMangas = Array.from(
          new Map(combined.map((m) => [m.id, m])).values()
        );
        return uniqueMangas;
      });

      setOffset((prev) => prev + BATCH_SIZE);

      if (offset + BATCH_SIZE >= limit) {
        setAutoLoadFinished(true);
      }
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les mangas.");
    } finally {
      setLoading(false);
    }
  }, [loading, offset, limit]);

  useEffect(() => {
    loadMangas();
  }, []);

  useEffect(() => {
    if (autoLoadFinished) return;

    function onScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight =
        window.innerHeight || document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 700 && !loading) {
        loadMangas();
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [loadMangas, loading, autoLoadFinished]);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="grid grid-cols-3 gap-x-2 gap-y-6 w-full max-w-full lg:flex lg:flex-wrap 2xl:w-[70%] xl:gap-x-12 lg:justify-center">
        {mangas.map((manga) => (
          <div key={manga.id} className="flex flex-col items-center gap-2">
            <div className="w-[100px] h-[150px] lg:w-[240px] lg:h-[360px] bg-gray-200 flex items-center justify-center">
              <img
                src={manga.coverUrl}
                alt={`${manga.title} cover`}
                className="w-full h-full object-cover cursor-pointer"
                onError={(e) => {
                  console.warn("Erreur de chargement cover:", manga.coverUrl);
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

      {loading && <p>Chargement...</p>}

      {autoLoadFinished && (
        <div className="text-center mt-6">
          <ButtonAnimated
            text={"Afficher plus"}
            justify={"justify-center"}
            onClick={() => {
              setLimit((prev) => prev + LIMIT_STEP);
              setAutoLoadFinished(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
