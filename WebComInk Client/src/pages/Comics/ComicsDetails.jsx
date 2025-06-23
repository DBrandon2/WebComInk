import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMangas } from "../../services/mangaService";
import { enrichMangas, slugify } from "../../utils/mangaUtils";

export default function ComicsDetails() {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchManga() {
      setLoading(true);
      setError(null);
      try {
        // Recherche rapide par id
        const data = await getMangas({
          limit: 1,
          ids: [id],
          includes: ["author", "artist", "cover_art"],
        });
        const enriched = enrichMangas(data.data);
        const manga = enriched[0] || null;
        setManga(manga);

        // Si le slug ne correspond pas, redirige vers la bonne URL (SEO)
        if (manga && slugify(manga.title) !== slug) {
          navigate(`/Comics/${manga.id}/${slugify(manga.title)}`, {
            replace: true,
          });
        }
      } catch (err) {
        setError("Erreur lors du chargement du manga.");
      } finally {
        setLoading(false);
      }
    }
    fetchManga();
  }, [id, slug, navigate]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-400">{error}</div>;
  if (!manga) return <div className="text-accent">Manga introuvable.</div>;

  return (
    <div>
      <h1 className="text-3xl text-accent font-bold mb-4">{manga.title}</h1>
      {/* Affiche ici les infos détaillées du manga */}
      <img
        src={manga.coverUrl}
        alt={manga.title}
        className="w-64 h-96 object-cover mb-4"
      />
      <div>Auteur : {manga.authorName}</div>
      {manga.artistName !== manga.authorName && (
        <div>Artiste : {manga.artistName}</div>
      )}
      {/* Ajoute ici d'autres infos selon ton besoin */}
    </div>
  );
}
