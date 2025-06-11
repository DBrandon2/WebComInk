import React, { useEffect, useState } from "react";
import { getMangas } from "../../services/mangaService";

export default function MangaList() {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMangas() {
      try {
        const data = await getMangas(10, "fr");
        console.log("Données reçues :", data);
        setMangas(data.data);
      } catch (err) {
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
          <h3>{manga.attributes.title.fr || "Titre non dispo"}</h3>
          {/* Exemple d'image couverture - faut construire l'url avec le coverId */}
          {manga.relationships
            .filter((rel) => rel.type === "cover_art")
            .map((cover) => {
              const fileName = cover.attributes.fileName;
              const coverUrl = `https://uploads.mangadex.org/covers/${manga.id}/${fileName}`;
              return (
                <img
                  key={cover.id}
                  src={coverUrl}
                  alt={`${manga.attributes.title.fr} cover`}
                  style={{ width: 150, height: 220, objectFit: "cover" }}
                />
              );
            })}
        </div>
      ))}
    </div>
  );
}
