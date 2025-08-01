import React, { useState, useEffect, useContext } from "react";
import {
  getFavorites,
  removeFavorite,
  updateFavoriteStatus,
  getCustomCategories,
  addCustomCategory,
  removeCustomCategory,
  renameCustomCategory,
} from "../../services/favoriteService";
import { Link, useNavigate } from "react-router-dom";
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
import { toast } from "react-hot-toast";
import TopBarMobile from "../Comics/TopBarMobile";
import Breadcrumb from "../../components/shared/Breadcrumb";
import { AuthContext } from "../../context/AuthContext";
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
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Vérification d'authentification
  useEffect(() => {
    if (!user) {
      // Ne pas rediriger, juste afficher le message d'invitation
      return;
    }
  }, [user, navigate]);

  // Si pas d'utilisateur, afficher le message d'invitation
  if (!user) {
    return (
      <div className="container mx-auto p-4 mt-12">
        <Breadcrumb
          items={[{ label: "Accueil", link: "/" }, { label: "Bibliothèque" }]}
        />
        <TopBarMobile />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-accent mb-4">
              Ma Bibliothèque
            </h1>
            <p className="text-gray-300 mb-6">
              Connecte-toi ou inscris-toi pour accéder à ta bibliothèque
              personnelle et gérer tes mangas favoris.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth"
                className="bg-accent text-dark-bg px-6 py-3 rounded-lg font-semibold hover:bg-accent/80 transition-colors"
              >
                Se connecter
              </Link>
              <Link
                to="/auth"
                className="bg-accent-hover text-accent px-6 py-3 rounded-lg font-semibold border border-accent hover:bg-accent hover:text-dark-bg transition-colors"
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("addedAt"); // "addedAt", "title"
  const [sortOrder, setSortOrder] = useState("desc"); // "asc", "desc"
  const [tab, setTab] = useState("");
  const [customCategories, setCustomCategories] = useState([]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addCatLoading, setAddCatLoading] = useState(false);
  const [addCatError, setAddCatError] = useState("");
  // Pour le renommage
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [renameLoading, setRenameLoading] = useState(false);
  const [renameError, setRenameError] = useState("");
  // Pour la suppression
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedMangaForCategory, setSelectedMangaForCategory] =
    useState(null);

  // Catégorie sélectionnée est-elle personnalisée ?
  const isCustomTab = customCategories.includes(tab);

  // Handler suppression
  const handleDeleteCategory = async () => {
    setDeleteLoading(true);
    try {
      await removeCustomCategory(tab);
      setCustomCategories((prev) => prev.filter((cat) => cat !== tab));
      setTab("en-cours");
      setShowDeleteConfirm(false);
    } catch (err) {
      // Optionnel : afficher une erreur
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handler renommage
  const handleStartRename = () => {
    setIsRenaming(true);
    setRenameValue(tab);
    setRenameError("");
  };
  const handleCancelRename = () => {
    setIsRenaming(false);
    setRenameValue("");
    setRenameError("");
  };
  const handleRenameCategory = async (e) => {
    e.preventDefault();
    const newName = renameValue.trim();
    if (!newName) {
      setRenameError("Le nom ne peut pas être vide.");
      return;
    }
    if (newName.length > 8) {
      setRenameError("Le nom ne peut pas dépasser 8 caractères.");
      return;
    }
    if (newName === tab) {
      // Si l'utilisateur n'a pas modifié le nom, on annule simplement
      setIsRenaming(false);
      setRenameValue("");
      setRenameError("");
      toast.success("Catégorie renommée avec succès !", {
        position: window.innerWidth < 640 ? "bottom-center" : "bottom-right",
        style: {
          fontSize: window.innerWidth < 640 ? "1rem" : "1.1rem",
          borderRadius: "8px",
          background: "#222",
          color: "#edf060",
          minWidth: window.innerWidth < 640 ? "90vw" : "300px",
          textAlign: "center",
        },
      });
      return;
    }
    setRenameLoading(true);
    setRenameError("");
    try {
      await renameCustomCategory(tab, newName);
      setCustomCategories((prev) =>
        prev.map((cat) => (cat === tab ? newName : cat))
      );
      setTab(newName);
      setIsRenaming(false);
      toast.success("Catégorie renommée avec succès !", {
        position: window.innerWidth < 640 ? "bottom-center" : "bottom-right",
        style: {
          fontSize: window.innerWidth < 640 ? "1rem" : "1.1rem",
          borderRadius: "8px",
          background: "#222",
          color: "#edf060",
          minWidth: window.innerWidth < 640 ? "90vw" : "300px",
          textAlign: "center",
        },
      });
    } catch (err) {
      setRenameError(err.message || "Erreur lors du renommage.");
    } finally {
      setRenameLoading(false);
    }
  };

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
        delay: 250,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        const data = await getFavorites();
        // LOG : favoris reçus
        console.log("[Library] Favoris reçus :", data);
        setFavorites(data);
        setError(null);
      } catch (err) {
        setError("Impossible de charger vos favoris. Veuillez vous connecter.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const loadCustomCategories = async () => {
      try {
        const cats = await getCustomCategories();
        setCustomCategories(Array.isArray(cats) ? cats : []);
      } catch (err) {
        setCustomCategories([]);
      }
    };

    loadFavorites();
    loadCustomCategories();
  }, []);

  // Effet pour filtrer et trier les favoris
  useEffect(() => {
    // On filtre d'abord par catégorie courante
    let filtered = favorites.filter(
      (manga) => (manga.status || "en-cours") === tab
    );
    // Puis on filtre par terme de recherche
    if (searchTerm.trim()) {
      filtered = filtered.filter((manga) =>
        manga.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
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
  }, [favorites, searchTerm, sortBy, sortOrder, tab]);

  // Quand customCategories change, sélectionne la première catégorie si tab n'est pas valide
  useEffect(() => {
    if (customCategories.length > 0 && !customCategories.includes(tab)) {
      setTab(customCategories[0]);
    }
  }, [customCategories]);

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

  // Ajout d'une catégorie personnalisée
  const handleOpenAddCategory = () => {
    setShowAddCategoryModal(true);
    setNewCategoryName("");
    setAddCatError("");
  };
  const handleCloseAddCategory = () => {
    setShowAddCategoryModal(false);
    setNewCategoryName("");
    setAddCatError("");
  };
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setAddCatError("Le nom ne peut pas être vide.");
      return;
    }
    if (newCategoryName.trim().length > 8) {
      setAddCatError("Le nom ne peut pas dépasser 8 caractères.");
      return;
    }
    if (customCategories.length >= 8) {
      setAddCatError("Vous ne pouvez pas créer plus de 8 catégories.");
      return;
    }
    setAddCatLoading(true);
    setAddCatError("");
    try {
      await addCustomCategory(newCategoryName.trim());
      setCustomCategories((prev) => [...prev, newCategoryName.trim()]);
      handleCloseAddCategory();
    } catch (err) {
      setAddCatError(err.message || "Erreur lors de l'ajout.");
    } finally {
      setAddCatLoading(false);
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

  // Désormais, toutes les catégories viennent du backend (customCategories)
  const allCategories = customCategories.map((cat) => [cat, cat]);

  // Affichage debug pour mobile/iPad (affiche les données reçues)
  const debugStyle = {
    background: "#222",
    color: "#edf060",
    padding: 8,
    fontSize: 12,
    marginBottom: 16,
    borderRadius: 8,
    maxHeight: 200,
    overflow: "auto",
    wordBreak: "break-all",
    zIndex: 9999,
  };

  // Fallback : si aucune catégorie, on affiche tous les mangas
  const hasCategories = customCategories && customCategories.length > 0;
  const mangasToShow = hasCategories
    ? filteredFavorites.filter((manga) => (manga.status || "en-cours") === tab)
    : favorites;

  return (
    <div className="container mx-auto p-4 mt-12">
      <Breadcrumb
        items={[{ label: "Accueil", link: "/" }, { label: "Bibliothèque" }]}
      />
      <TopBarMobile />
      {/* Onglets de tri dynamiques */}
      {hasCategories ? (
        <div className="flex items-center justify-center mb-4">
          <div className="flex gap-4 sm:gap-4 items-center overflow-x-auto whitespace-nowrap px-4 sm:px-8 py-4 scrollbar-none w-full min-w-0 ">
            {customCategories.map((key) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className={`px-6 py-3 text-sm sm:px-5 sm:py-2 sm:text-base rounded-md font-semibold border-1 shadow flex items-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 cursor-pointer
                  ${
                    tab === key
                      ? "bg-accent text-dark-bg border-accent"
                      : "bg-accent-hover text-accent border-accent "
                  }`}
                onClick={() => setTab(key)}
              >
                {key}
              </motion.button>
            ))}
            {/* Bouton + pour ajouter une catégorie */}
            {customCategories.length < 8 && (
              <button
                onClick={handleOpenAddCategory}
                className="w-8 h-8 text-xl sm:w-10 sm:h-10 sm:text-2xl rounded hover:bg-accent-hover text-accent leading-none flex items-center justify-center transition ml-1 sm:ml-2 p-0 cursor-pointer"
                title="Ajouter une catégorie"
              >
                <span className="relative -top-0.5">+</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center text-accent font-bold mb-6">
          Aucune catégorie personnalisée trouvée. Tous les mangas sont affichés.
        </div>
      )}
      {/* Boutons de gestion de catégorie personnalisée */}
      {/* SUPPRIMÉ : zone des boutons de modification/suppression dans la barre d'onglets */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">
          Ma Bibliothèque ({favorites.length} manga
          {favorites.length > 1 ? "s" : ""})
        </h1>

        {/* Barre de recherche et gestion de catégorie */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
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

          {/* Boutons de gestion de catégorie personnalisée */}
          {isCustomTab && (
            <div className="flex gap-1 sm:gap-2 items-center">
              {/* Renommer */}
              {isRenaming ? (
                <form
                  onSubmit={handleRenameCategory}
                  className="flex gap-1 items-center"
                >
                  <input
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    className="px-2 py-1 rounded border-1 border-accent bg-accent-hover text-accent font-semibold focus:outline-none focus:ring-1 w-20 sm:w-28"
                    maxLength={8}
                    disabled={renameLoading}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleCancelRename}
                    className="px-2 py-1 rounded bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400 hover:text-gray-100 transition disabled:opacity-60 text-xs sm:text-base cursor-pointer"
                    disabled={renameLoading}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-2 py-1 rounded bg-accent text-dark-bg font-bold hover:bg-accent-hover hover:text-gray-200 transition disabled:opacity-60 text-xs sm:text-base cursor-pointer"
                    disabled={renameLoading}
                  >
                    OK
                  </button>
                </form>
              ) : (
                <button
                  onClick={handleStartRename}
                  className="p-1 sm:p-2 rounded hover:bg-accent-hover text-accent cursor-pointer"
                  title="Renommer la catégorie"
                >
                  <Edit3 size={22} className="sm:hidden" />
                  <Edit3 size={26} className="hidden sm:inline" />
                </button>
              )}
              {/* Supprimer */}
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1 sm:p-2 rounded hover:bg-red-100 text-red-500 cursor-pointer"
                title="Supprimer la catégorie"
              >
                <Trash2 size={22} className="sm:hidden" />
                <Trash2 size={26} className="hidden sm:inline" />
              </button>
            </div>
          )}
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
          <div className="library-grid-container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-6 w-full">
            {mangasToShow.map((manga, index) => (
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

      {/* Message si aucun manga dans l'onglet ou dans la bibliothèque */}
      {mangasToShow.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Aucun manga à afficher dans cette catégorie ou bibliothèque vide.
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

      {/* Modal d'ajout de catégorie personnalisée */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-dark-bg rounded-2xl shadow-2xl p-6 w-full max-w-xs sm:max-w-sm relative animate-fade-in"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center text-accent">
              Nouvelle catégorie
            </h2>
            <form onSubmit={handleAddCategory}>
              <input
                type="text"
                className="w-full border-1 border-white rounded-lg px-3 py-2 mb-2 hover:bg-accent-hover focus:bg-accent-hover  placeholder:white/60 focus:placeholder:accent focus:outline-none  focus:border-accent text-base font-semibold transition"
                placeholder={inputFocused ? "" : "Nom de la catégorie"}
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                maxLength={8}
                disabled={addCatLoading}
              />
              {addCatError && (
                <div className="text-red-500 text-center font-semibold mb-2">
                  {addCatError}
                </div>
              )}
              <div className="flex gap-3 mt-3 justify-center">
                <button
                  type="button"
                  onClick={handleCloseAddCategory}
                  className="w-full border border-gray-400 text-gray-400 py-2 rounded cursor-pointer font-medium hover:text-white hover:bg-gray-500 transition"
                  disabled={addCatLoading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-full border border-accent text-accent hover:text-dark-bg hover:bg-accent transition py-2 rounded cursor-pointer font-medium"
                  disabled={addCatLoading}
                >
                  {addCatLoading ? "Ajout..." : "Ajouter"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {/* Modal de confirmation suppression catégorie */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-dark-bg rounded-2xl shadow-2xl p-6 w-full max-w-xs sm:max-w-sm relative border-2 border-accent">
            <h2 className="text-lg font-bold mb-4 text-center text-accent">
              Supprimer la catégorie ?
            </h2>
            <p className="text-center text-gray-200 mb-4">
              Cette action est irréversible.
              <br />
              Les mangas de cette catégorie ne seront pas supprimés.
            </p>
            <div className="flex gap-3 justify-center mt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400 transition"
                disabled={deleteLoading}
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteCategory}
                className="px-4 py-2 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition disabled:opacity-60"
                disabled={deleteLoading}
              >
                {deleteLoading ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Message d'erreur renommage */}
      {isRenaming && renameError && (
        <div className="text-red-500 text-center font-semibold mb-2">
          {renameError}
        </div>
      )}
    </div>
  );
}
