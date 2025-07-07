import React, { useState, useEffect } from "react";
import {
  getFavorites,
  removeFavorite,
  updateFavoriteStatus,
} from "../../services/favoriteService";
import { Link } from "react-router-dom";
import {
  Trash2,
  Search,
  SortAsc,
  SortDesc,
  Calendar,
  BookOpen,
  Edit3,
} from "lucide-react";
import { slugify } from "../../utils/mangaUtils";
import LibraryMangaCard from "../../components/shared/LibraryMangaCard";
import { motion } from "framer-motion";
import CategorySelectionModal from "../../components/modals/CategorySelectionModal";
// Suppression de l'import inutile de @hello-pangea/dnd
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SortableMangaCard from "../../components/shared/SortableMangaCard";
import { setLastDropTime } from "../../utils/dragDropState";

export default function Library() {
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("addedAt"); // "addedAt", "title"
  const [sortOrder, setSortOrder] = useState("desc"); // "asc", "desc"
  const [tab, setTab] = useState("en-cours");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedMangaForCategory, setSelectedMangaForCategory] =
    useState(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Déclaration des sensors dnd-kit tout en haut du composant, hors de toute condition !
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250, // délai en ms avant activation du drag
        tolerance: 5, // distance minimale de mouvement avant activation (optionnel)
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 0, // délai réduit à 0ms pour le mobile
        tolerance: 5,
      },
    })
  );

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
    // Tri par ordre si présent, sinon par le critère choisi
    if (filtered.length > 0 && filtered[0].order !== undefined) {
      filtered.sort((a, b) => a.order - b.order);
    } else {
      filtered.sort((a, b) => {
        let comparison = 0;
        if (sortBy === "title") {
          comparison = a.title.localeCompare(b.title);
        } else if (sortBy === "addedAt") {
          comparison = new Date(a.addedAt) - new Date(b.addedAt);
        }

        return sortOrder === "asc" ? comparison : -comparison;
      });
    }

    setFilteredFavorites(filtered);
  }, [favorites, searchTerm, sortBy, sortOrder]);

  const filteredByTab = filteredFavorites.filter(
    (manga) => (manga.status || "en-cours") === tab
  );

  // Fonction appelée au début du drag
  const handleDragStart = (start) => {
    setIsDragging(true);
    setDraggedOverIndex(start.source.index);
  };

  // Fonction appelée pendant le drag pour un feedback en temps réel
  const handleDragUpdate = (update) => {
    if (update.destination) {
      setDraggedOverIndex(update.destination.index);
    }
  };

  // Fonction de drag & drop qui met à jour l'ordre côté client ET côté serveur
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Signale qu'un drop vient d'avoir lieu
    setLastDropTime();

    const currentTabMangas = favorites.filter(
      (fav) => (fav.status || "en-cours") === tab
    );
    const others = favorites.filter(
      (fav) => (fav.status || "en-cours") !== tab
    );
    const oldIndex = currentTabMangas.findIndex(
      (fav) => fav.mangaId === active.id
    );
    const newIndex = currentTabMangas.findIndex(
      (fav) => fav.mangaId === over.id
    );
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(currentTabMangas, oldIndex, newIndex);
    reordered.forEach((fav, idx) => {
      fav.order = idx;
    });
    setFavorites([...others, ...reordered]);

    try {
      const { saveFavoritesOrder } = await import(
        "../../services/favoriteService"
      );
      await saveFavoritesOrder(
        tab,
        reordered.map((fav) => fav.mangaId)
      );
    } catch (err) {
      // En cas d'erreur, on pourrait restaurer l'ordre précédent
      console.error("Erreur lors de la sauvegarde de l'ordre:", err);
      // Optionnel: restaurer l'ordre précédent
      // setFavorites([...others, ...currentTabMangas]);
    }
  };

  const handleRemoveFavorite = async (mangaId) => {
    try {
      await removeFavorite(mangaId);
      setFavorites(favorites.filter((fav) => fav.mangaId !== mangaId));
      // Pas de toast
    } catch (err) {
      // Pas de toast
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

  const handleChangeMangaCategory = (manga) => {
    setSelectedMangaForCategory(manga);
    setShowCategoryModal(true);
  };

  const handleCategoryUpdate = async (newCategory) => {
    if (!selectedMangaForCategory) return;
    try {
      await updateFavoriteStatus(selectedMangaForCategory.mangaId, newCategory);
      setFavorites(
        favorites.map((fav) =>
          fav.mangaId === selectedMangaForCategory.mangaId
            ? { ...fav, status: newCategory }
            : fav
        )
      );
      // Pas de toast
    } catch (err) {
      // Pas de toast
      console.error(err);
    } finally {
      setSelectedMangaForCategory(null);
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
      {/* Onglets de tri */}
      <div className="flex gap-2 mb-6 justify-center">
        {[
          ["en-cours", "En cours"],
          ["en-pause", "En pause"],
          ["a-lire", "À lire"],
          ["lu", "Lu"],
        ].map(([key, label]) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className={`px-5 py-2 rounded-md font-semibold border-2 shadow flex items-center transition-all duration-150 text-base focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 cursor-pointer
              ${
                tab === key
                  ? "bg-accent text-dark-bg border-accent"
                  : "bg-accent-hover text-accent border-accent "
              }`}
            onClick={() => setTab(key)}
          >
            {label}
          </motion.button>
        ))}
      </div>
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
      {filteredByTab.length === 0 && searchTerm.trim() && (
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

      {/* Grille des mangas avec drag & drop côté client */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={favorites
            .filter((fav) => (fav.status || "en-cours") === tab)
            .map((fav) => fav.mangaId)}
          strategy={rectSortingStrategy}
        >
          <div className="library-grid-container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-6 w-full">
            {favorites
              .filter((fav) => (fav.status || "en-cours") === tab)
              .map((manga, index) => (
                <SortableMangaCard
                  key={manga.mangaId}
                  manga={manga}
                  index={index}
                  onRemove={() => handleRemoveFavorite(manga.mangaId)}
                  onChangeCategory={() => handleChangeMangaCategory(manga)}
                />
              ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Message si aucun manga dans l'onglet */}
      {filteredByTab.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Aucun manga dans cet onglet.
        </div>
      )}

      {/* Modal de changement de catégorie */}
      <CategorySelectionModal
        isOpen={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false);
          setSelectedMangaForCategory(null);
        }}
        onSelectCategory={handleCategoryUpdate}
        mangaTitle={selectedMangaForCategory?.title || ""}
      />
    </div>
  );
}
