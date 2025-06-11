import React, { useEffect, useState } from "react";
import { getMangas, getCoverById } from "../../services/mangaService";

export default function MangaList() {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMangas() {
      try {
        const data = await getMangas(20, "fr");
        const mangasData = data.data;

        // Pour chaque manga on récupère son cover_url
        const mangasWithCover = await Promise.all(
          mangasData.map(async (manga) => {
            const coverRel = manga.relationships.find(
              (rel) => rel.type === "cover_art"
            );

            if (!coverRel) return { ...manga, coverUrl: null };

            // Appel pour récupérer le filename du cover
            const fileName = await getCoverById(coverRel.id);

            if (!fileName) return { ...manga, coverUrl: null };

            const coverUrl = `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg`;
            return { ...manga, coverUrl };
          })
        );

        setMangas(mangasWithCover);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les mangas");
      } finally {
        setLoading(false);
      }
    }

    fetchMangas();
  }, []);

  if (loading) return <p>Chargement des mangas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="manga-list">
      {mangas.map((manga) => (
        <div key={manga.id} className="manga-card">
          <h3>
            {manga.attributes.title.fr ||
              manga.attributes.title.en ||
              "Titre non dispo"}
          </h3>
          {manga.coverUrl ? (
            <img
              src={manga.coverUrl}
              alt={`${
                manga.attributes.title.fr || manga.attributes.title.en
              } cover`}
              style={{ width: 150, height: 220, objectFit: "cover" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-cover.png"; // fallback local si tu veux
              }}
            />
          ) : (
            <p>Pas d'image disponible</p>
          )}
        </div>
      ))}
    </div>
  );
}
