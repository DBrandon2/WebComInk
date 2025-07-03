import React, { useState, useEffect } from "react";
import { getFavorites, removeFavorite } from "../../services/favoriteService";
import { Link } from "react-router-dom";
import {
  Trash2,
  Search,
  SortAsc,
  SortDesc,
  Calendar,
  BookOpen,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { slugify } from "../../utils/mangaUtils";
import MangaCard from "../../components/shared/MangaCard";

export default function Library() {
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("addedAt"); // "addedAt", "title"
  const [sortOrder, setSortOrder] = useState("desc"); // "asc", "desc"

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

  // Effet pour filtrer et trier les favoris
  useEffect(() => {
    let filtered = [...favorites];

    // Filtrage par terme de recherche
    if (searchTerm.trim()) {
      filtered = filtered.filter((manga) =>
        manga.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tri
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortBy === "title") {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === "addedAt") {
        comparison = new Date(a.addedAt) - new Date(b.addedAt);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredFavorites(filtered);
  }, [favorites, searchTerm, sortBy, sortOrder]);

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

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
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
        <BookOpen size={64} className="text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Ma Bibliothèque</h1>
        <p className="text-gray-700 mb-6 text-center">
          Vous n'avez pas encore de mangas dans vos favoris.
          <br />
          Explorez notre catalogue et ajoutez vos mangas préférés !
        </p>
        <Link
          to="/Comics"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Découvrir des mangas
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">
          Ma Bibliothèque ({favorites.length} manga
          {favorites.length > 1 ? "s" : ""})
        </h1>

        {/* Barre de recherche et tri */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Recherche */}
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Rechercher un manga..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
            />
          </div>

          {/* Boutons de tri */}
          <div className="flex gap-2">
            <button
              onClick={() => handleSortChange("title")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                sortBy === "title"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
              title="Trier par titre"
            >
              <BookOpen size={16} />
              {sortBy === "title" &&
                (sortOrder === "asc" ? (
                  <SortAsc size={16} />
                ) : (
                  <SortDesc size={16} />
                ))}
            </button>

            <button
              onClick={() => handleSortChange("addedAt")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                sortBy === "addedAt"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
              title="Trier par date d'ajout"
            >
              <Calendar size={16} />
              {sortBy === "addedAt" &&
                (sortOrder === "asc" ? (
                  <SortAsc size={16} />
                ) : (
                  <SortDesc size={16} />
                ))}
            </button>
          </div>
        </div>
      </div>

      {/* Message si aucun résultat après recherche */}
      {filteredFavorites.length === 0 && searchTerm.trim() && (
        <div className="text-center py-12">
          <Search size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            Aucun manga trouvé pour "{searchTerm}"
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-4 px-4 py-2 text-blue-500 hover:text-blue-600 transition-colors"
          >
            Effacer la recherche
          </button>
        </div>
      )}

      {/* Grille des mangas */}
      {filteredFavorites.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-6 w-full">
          {filteredFavorites.map((manga) => (
            <MangaCard
              key={manga.mangaId}
              id={manga.mangaId}
              title={manga.title}
              coverUrl={manga.coverImage}
              authorName={manga.author}
              artistName={manga.artist}
              removable={true}
              onRemove={handleRemoveFavorite}
              to={`/Comics/${manga.mangaId}/${slugify(manga.title)}`}
            >
              <Trash2 size={16} />
            </MangaCard>
          ))}
        </div>
      )}
    </div>
  );
}
