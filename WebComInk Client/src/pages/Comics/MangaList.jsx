import React, { useEffect, useState, useCallback } from "react";
import { getMangas } from "../../services/mangaService";
import ButtonAnimated from "../../components/ButtonAnimated";

const BATCH_SIZE = 18;
const LIMIT_STEP = 300; // nombre max de mangas chargés automatiquement par tranche

export default function MangaList() {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [autoLoadFinished, setAutoLoadFinished] = useState(false);
  const [limit, setLimit] = useState(LIMIT_STEP); // limite dynamique

  const loadMangas = useCallback(async () => {
    if (loading) {
      console.log("loadMangas appelé mais déjà en cours...");
      return;
    }

    if (offset >= limit) {
      console.log("Limite atteinte, pas de nouveau fetch.");
      setAutoLoadFinished(true);
      return;
    }

    console.log(
      `Début du fetch: offset=${offset}, limit=${limit}, batchSize=${BATCH_SIZE}`
    );
    setLoading(true);
    try {
      const data = await getMangas(BATCH_SIZE, "fr", offset);
      const mangasData = data.data;
      console.log(`Fetch terminé, récupéré ${mangasData.length} mangas`);

      if (mangasData.length === 0) {
        console.log("Aucun manga récupéré, fin du chargement automatique.");
        setAutoLoadFinished(true);
        return;
      }

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
        console.log(
          `Mangas totaux uniques après fusion : ${uniqueMangas.length}`
        );
        return uniqueMangas;
      });

      setOffset((prev) => {
        const newOffset = prev + BATCH_SIZE;
        console.log(`Offset mis à jour : ${newOffset}`);
        return newOffset;
      });

      if (offset + BATCH_SIZE >= limit) {
        console.log("Limite atteinte, arrêt du chargement automatique.");
        setAutoLoadFinished(true);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des mangas :", err);
      setError("Impossible de charger les mangas");
    } finally {
      setLoading(false);
      console.log("Chargement terminé, loading=false");
    }
  }, [loading, offset, limit]);

  // Chargement automatique au début
  useEffect(() => {
    console.log("Composant monté, lancement du premier chargement");
    loadMangas();
  }, []); // on veut un seul appel au début

  // Gestion du scroll automatique tant que pas limite atteinte
  useEffect(() => {
    if (autoLoadFinished) {
      console.log("Chargement automatique terminé, scroll non écouté");
      return;
    }

    function onScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight =
        window.innerHeight || document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 700 && !loading) {
        console.log(
          "Scroll proche du bas détecté, chargement de nouveaux mangas"
        );
        loadMangas();
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      console.log("Listener scroll retiré");
    };
  }, [loadMangas, loading, autoLoadFinished]);

  // **On SUPPRIME le useEffect qui lançait loadMangas sur changement de limite**

  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="grid grid-cols-3 gap-x-2 gap-y-6 w-full max-w-full lg:flex lg:flex-wrap 2xl:w-[70%] xl:gap-x-12 lg:justify-center">
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
      </div>

      {loading && <p>Chargement...</p>}

      {autoLoadFinished && (
        <div className="text-center mt-6">
          <ButtonAnimated
            text={"Afficher plus"}
            justify={"justify-center"}
            onClick={() => {
              console.log(
                "Bouton 'Afficher plus' cliqué, augmentation de la limite"
              );
              setLimit((prevLimit) => prevLimit + LIMIT_STEP);
              setAutoLoadFinished(false); // on réactive le scroll
              // PAS d'appel direct à loadMangas ici !
            }}
          />
        </div>
      )}
    </div>
  );
}
