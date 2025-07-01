import React, { useState, useEffect } from "react";
import { getFavorites, removeFavorite } from "../../services/favoriteService";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { slugify } from "../../utils/mangaUtils";

export default function Library() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        const data = await getFavorites();
        setFavorites(data);
        setError(null);
      } catch (err) {
        setError("Impossible de charger vos favoris. Veuillez vous connecter.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const handleRemoveFavorite = async (mangaId) => {
    try {
      await removeFavorite(mangaId);
      setFavorites(favorites.filter((fav) => fav.mangaId !== mangaId));
      toast.success("Manga retiré des favoris");
    } catch (err) {
      toast.error("Erreur lors de la suppression du favori");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-red-500 mb-4">Erreur</h2>
        <p className="text-gray-700 mb-6">{error}</p>
        <Link
          to="/auth"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Ma Bibliothèque</h1>
        <p className="text-gray-700 mb-6">
          Vous n'avez pas encore de mangas dans vos favoris.
        </p>
        <Link
          to="/"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Découvrir des mangas
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Ma Bibliothèque</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {favorites.map((manga) => (
          <div
            key={manga.mangaId}
            className="bg-white rounded-lg shadow-md overflow-hidden relative group"
          >
            <Link to={`/Comics/${manga.id}/${slugify(manga.title)}`}>
              <div className="h-64 overflow-hidden">
                <img
                  src={
                    manga.coverImage ||
                    "https://via.placeholder.com/300x400?text=No+Image"
                  }
                  alt={manga.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm line-clamp-2">
                  {manga.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Ajouté le {new Date(manga.addedAt).toLocaleDateString()}
                </p>
              </div>
            </Link>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRemoveFavorite(manga.mangaId);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              title="Retirer des favoris"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
