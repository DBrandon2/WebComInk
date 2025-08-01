import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import defaultAvatar from "../../assets/defaultAvatar.jpg";
import { update, getReadingHistory } from "../../apis/auth.api";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { enrichMangas } from "../../utils/mangaUtils";
import { supabase } from "../../utils/supabaseClient";
import { updateAvatar } from "../../apis/auth.api";
import Breadcrumb from "../../components/shared/Breadcrumb";

export default function Profile() {
  const { user, logout, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    currentPassword: "",
    currentEmail: "",
    newEmail: "",
  });
  const [loading, setLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [readingHistory, setReadingHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [errorHistory, setErrorHistory] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [coversMap, setCoversMap] = useState({});
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const inputAvatarRef = React.useRef(null);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFinalDeleteModal, setShowFinalDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // États pour la sélection multiple de l'historique
  const [isHistorySelectionMode, setIsHistorySelectionMode] = useState(false);
  const [selectedHistoryItems, setSelectedHistoryItems] = useState([]);
  const [showDeleteSelectedModal, setShowDeleteSelectedModal] = useState(false);

  // Onglet sélectionné
  const [activeTab, setActiveTab] = useState("informations");

  // Fonction pour censurer partiellement l'email
  const censorEmail = (email) => {
    if (!email) return "";

    const [localPart, domain] = email.split("@");
    if (!domain) return email;

    // Censure la partie locale (avant @) - moins agressive
    let censoredLocal = localPart;
    if (localPart.length > 4) {
      // Garde les 2 premiers et 2 derniers caractères
      censoredLocal =
        localPart.substring(0, 2) +
        "*".repeat(localPart.length - 4) +
        localPart.substring(localPart.length - 2);
    } else if (localPart.length > 2) {
      // Garde le premier et dernier caractère
      censoredLocal =
        localPart.charAt(0) +
        "*".repeat(localPart.length - 2) +
        localPart.charAt(localPart.length - 1);
    } else {
      censoredLocal = "*".repeat(localPart.length);
    }

    // Ne censure que la partie locale, garde le domaine intact
    return `${censoredLocal}@${domain}`;
  };

  useEffect(() => {
    let mounted = true;
    async function fetchHistory() {
      setLoadingHistory(true);
      setErrorHistory(null);
      try {
        const res = await getReadingHistory();
        if (mounted) {
          setReadingHistory(res.readingHistory || []);
        }
      } catch (err) {
        if (mounted)
          setErrorHistory("Erreur lors du chargement de l'historique");
      } finally {
        if (mounted) setLoadingHistory(false);
      }
    }
    if (user) fetchHistory();
    return () => {
      mounted = false;
    };
  }, [user]);

  // Fetch covers manquantes
  useEffect(() => {
    const missing = readingHistory.filter(
      (entry) => !entry.coverImage && entry.mangaId && !coversMap[entry.mangaId]
    );
    if (missing.length === 0) return;
    let cancelled = false;
    const batchSize = 12;
    const delay = 500; // ms entre chaque batch
    async function fetchCoversBatch() {
      let i = 0;
      while (i < missing.length && !cancelled) {
        const batch = missing.slice(i, i + batchSize);
        const updates = {};
        await Promise.all(
          batch.map(async (entry) => {
            try {
              const res = await fetch(
                `${
                  import.meta.env.VITE_API_URL || "http://localhost:3000"
                }/manga?ids=${entry.mangaId}&includes[]=cover_art`
              );
              const data = await res.json();
              const enriched = enrichMangas(data.data);
              const coverUrl = enriched[0]?.coverUrl;
              if (coverUrl && !cancelled) {
                updates[entry.mangaId] = coverUrl;
              }
            } catch (e) {
              // On ignore l'erreur pour ce manga
            }
          })
        );
        if (!cancelled && Object.keys(updates).length > 0) {
          setCoversMap((prev) => ({ ...prev, ...updates }));
        }
        i += batchSize;
        if (i < missing.length) {
          await new Promise((res) => setTimeout(res, delay));
        }
      }
    }
    fetchCoversBatch();
    return () => {
      cancelled = true;
    };
  }, [readingHistory, coversMap]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl text-accent font-bold mb-4">Profil</h1>
        <p className="text-gray-400">Aucun utilisateur connecté.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setForm({
      username: user?.username || "",
      email: user?.email || "",
      password: "",
      currentPassword: "",
      currentEmail: "",
      newEmail: "",
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Vérifier si on change l'email
    if (form.newEmail && form.newEmail !== form.email) {
      // Vérifier que l'email actuel est correct
      if (form.currentEmail !== form.email) {
        alert("L'email actuel saisi ne correspond pas à votre email actuel.");
        return;
      }
      // Afficher le modal de validation
      setShowEmailModal(true);
      return;
    }

    // Sinon, sauvegarder normalement
    setLoading(true);
    try {
      const updatedUser = await update({
        _id: user._id,
        username: form.username,
        email: form.email,
        password: form.password || undefined,
      });
      setUser(updatedUser);
      setIsEditing(false);
      // Reset des champs email
      setForm((prev) => ({
        ...prev,
        currentEmail: "",
        newEmail: "",
      }));
    } catch (err) {
      // Gérer l'erreur si besoin
    } finally {
      setLoading(false);
    }
  };

  async function handleClearHistory() {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:3000"
        }/user/reading-history`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (res.ok) {
        setReadingHistory([]);
        setShowClearModal(false);
      } else {
        const data = await res.json();
        alert(data.message || "Erreur lors de la suppression de l'historique");
      }
    } catch (e) {
      alert("Erreur lors de la suppression de l'historique");
    }
  }

  // Handler pour ouvrir l'input file (depuis l'image ou le bouton)
  const openAvatarFileDialog = (e) => {
    // Suppression de la condition !isEditing
    if (e) e.stopPropagation();
    if (inputAvatarRef.current) {
      inputAvatarRef.current.click();
    }
  };

  // Handler pour sélectionner une image (mais ne pas l'uploader tout de suite)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedAvatarFile(file);
    setPreviewAvatar(URL.createObjectURL(file));
  };

  // Handler pour valider le changement d'avatar (upload)
  const handleValidateAvatar = async () => {
    if (!selectedAvatarFile) return;
    try {
      const formData = new FormData();
      formData.append("file", selectedAvatarFile);
      formData.append("upload_preset", "avatars_unsigned");
      formData.append("folder", "users/avatars");
      // Upload direct à Cloudinary
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/drib6vkyw/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (!data.secure_url) throw new Error("Erreur upload Cloudinary");
      // MAJ avatar côté back (persistant)
      const updatedUser = await updateAvatar({
        _id: user._id,
        avatar: data.secure_url,
      });
      setAvatar(data.secure_url);
      setUser(updatedUser);
      // MAJ localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setSelectedAvatarFile(null);
      setPreviewAvatar("");
    } catch (error) {
      console.log(error);
      alert("Erreur lors de l'upload de l'avatar.");
    }
  };

  // Handler suppression de compte (à compléter avec ton API)
  async function handleDeleteAccount() {
    setDeleteLoading(true);
    try {
      // Appelle ton API de suppression ici
      // await deleteAccount({ userId: user._id, confirmationWord: deleteInput });
      // logout();
      // navigate("/");
      // Pour la démo, on ferme tout
      setShowFinalDeleteModal(false);
      setShowDeleteModal(false);
      setDeleteInput("");
      // Ajoute ici la logique de déconnexion/redirect
    } catch (e) {
      // Gère l'erreur
    } finally {
      setDeleteLoading(false);
    }
  }

  // Fonctions pour la sélection multiple de l'historique
  const toggleHistorySelectionMode = () => {
    setIsHistorySelectionMode(!isHistorySelectionMode);
    setSelectedHistoryItems([]);
  };

  const toggleHistoryItemSelection = (mangaId) => {
    setSelectedHistoryItems((prev) =>
      prev.includes(mangaId)
        ? prev.filter((id) => id !== mangaId)
        : [...prev, mangaId]
    );
  };

  const selectAllHistoryItems = () => {
    const allMangaIds = readingHistory.map((entry) => entry.mangaId);
    setSelectedHistoryItems(allMangaIds);
  };

  const deselectAllHistoryItems = () => {
    setSelectedHistoryItems([]);
  };

  const handleDeleteSelectedHistory = async () => {
    try {
      // Ici on peut appeler l'API pour supprimer les éléments sélectionnés
      // await deleteHistoryItems(selectedHistoryItems);

      // Pour la démo, on filtre localement
      setReadingHistory((prev) =>
        prev.filter((entry) => !selectedHistoryItems.includes(entry.mangaId))
      );
      setSelectedHistoryItems([]);
      setIsHistorySelectionMode(false);
      setShowDeleteSelectedModal(false);
    } catch (error) {
      alert("Erreur lors de la suppression des éléments sélectionnés");
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans">
      {/* Header breadcrumb */}
      <Breadcrumb
        items={[{ label: "Accueil", link: "/" }, { label: "Profil" }]}
      />

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 flex flex-col items-center">
            {/* Avatar */}
            <div className="relative group mb-6">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-gray-800">
                <img
                  src={previewAvatar || avatar || defaultAvatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                <button
                  onClick={openAvatarFileDialog}
                  className="text-white text-sm font-medium cursor-pointer"
                >
                  Changer
                </button>
              </div>
            </div>
            <input
              type="file"
              ref={inputAvatarRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            {selectedAvatarFile && (
              <div className="flex gap-2 mt-2">
                <button
                  className="px-4 py-1 rounded bg-gray-500 text-white font-medium hover:bg-gray-600 transition cursor-pointer"
                  onClick={() => {
                    setSelectedAvatarFile(null);
                    setPreviewAvatar("");
                  }}
                  type="button"
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  className="px-4 py-1 rounded bg-accent text-white font-medium hover:bg-accent-hover transition cursor-pointer"
                  onClick={handleValidateAvatar}
                  type="button"
                  disabled={loading}
                >
                  Valider l'avatar
                </button>
              </div>
            )}
            {/* Actions rapides */}
            <div className="space-y-3 w-full mt-2">
              <button
                className="w-full bg-accent text-dark-bg py-2 px-4 rounded-lg font-medium hover:bg-accent/80 transition cursor-pointer"
                onClick={openAvatarFileDialog}
              >
                Changer d'avatar
              </button>
              <button
                className="w-full border border-red-500 text-red-500 text-lg py-2 px-4 rounded-lg hover:bg-red-500 hover:text-white hover:border-white transition cursor-pointer"
                onClick={logout}
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </aside>

        {/* Contenu principal avec onglets */}
        <main className="lg:col-span-2">
          <div className="bg-gray-900/50 rounded-xl border border-gray-800">
            {/* Onglets */}
            <div className="border-b border-gray-800">
              <nav className="flex justify-between px-4 sm:px-6 overflow-x-auto">
                <button
                  className={`py-4 px-2 sm:px-4 border-b-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base cursor-pointer ${
                    activeTab === "informations"
                      ? "border-accent text-accent"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("informations")}
                >
                  <span className="hidden sm:inline">Informations</span>
                  <span className="sm:hidden">Informations</span>
                </button>
                <button
                  className={`py-4 px-2 sm:px-4 border-b-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base cursor-pointer ${
                    activeTab === "historique"
                      ? "border-accent text-accent"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("historique")}
                >
                  <span className="hidden sm:inline">Historique</span>
                  <span className="sm:hidden">Historique</span>
                </button>
                <button
                  className={`py-4 px-2 sm:px-4 border-b-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base cursor-pointer ${
                    activeTab === "securite"
                      ? "border-accent text-accent"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("securite")}
                >
                  <span className="hidden sm:inline">Sécurité</span>
                  <span className="sm:hidden">Sécurité</span>
                </button>
              </nav>
            </div>

            {/* Contenu des onglets */}
            <div className="p-6">
              {activeTab === "informations" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-accent mb-4">
                    Informations personnelles
                  </h3>
                  <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nom d'utilisateur
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={form.username}
                          onChange={handleChange}
                          className={`w-full border rounded-lg px-4 py-3 transition-colors ${
                            isEditing
                              ? "bg-gray-800 border-gray-700 text-white focus:border-accent focus:ring-1 focus:ring-accent"
                              : "bg-gray-900/50 border-gray-600 text-gray-400 cursor-not-allowed"
                          }`}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email actuel
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={censorEmail(form.email)}
                          className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-gray-400 cursor-not-allowed"
                          disabled
                        />
                      </div>
                    </div>

                    {/* Champs email supplémentaires en mode édition */}
                    {isEditing && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Confirmer l'email actuel
                          </label>
                          <input
                            type="email"
                            name="currentEmail"
                            value={form.currentEmail}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:ring-1 focus:ring-accent transition-colors cursor-pointer"
                            placeholder="Votre email actuel"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Nouveau email
                          </label>
                          <input
                            type="email"
                            name="newEmail"
                            value={form.newEmail}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:ring-1 focus:ring-accent transition-colors cursor-pointer"
                            placeholder="Nouvel email"
                          />
                        </div>
                      </div>
                    )}

                    {isEditing && (
                      <div className="flex space-x-3 pt-4">
                        <button
                          type="button"
                          className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition cursor-pointer"
                          onClick={handleCancel}
                          disabled={loading}
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-accent text-dark-bg rounded-lg font-medium hover:bg-accent/80 transition cursor-pointer"
                          disabled={loading}
                        >
                          {loading ? "Sauvegarde..." : "Sauvegarder"}
                        </button>
                      </div>
                    )}
                  </form>

                  {/* Actions supplémentaires */}
                  <div className="border-t border-gray-700 pt-6 mt-8">
                    <h4 className="text-lg font-semibold text-accent mb-4">
                      Actions
                    </h4>
                    <div className="space-y-3">
                      <button
                        className="w-full bg-accent text-dark-bg py-2 px-4 rounded-lg font-medium hover:bg-accent/80 transition cursor-pointer"
                        onClick={handleEdit}
                        disabled={isEditing}
                      >
                        Modifier le profil
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "historique" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-accent">
                      Historique de lecture
                    </h3>
                    <div className="flex items-center gap-2">
                      {isHistorySelectionMode && (
                        <>
                          <button
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
                            onClick={selectAllHistoryItems}
                            title="Tout sélectionner"
                          >
                            Tout
                          </button>
                          <button
                            className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition cursor-pointer"
                            onClick={deselectAllHistoryItems}
                            title="Tout désélectionner"
                          >
                            Aucun
                          </button>

                          <button
                            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition cursor-pointer"
                            onClick={toggleHistorySelectionMode}
                            title="Quitter la sélection"
                          >
                            Annuler
                          </button>
                        </>
                      )}
                      <button
                        className="p-2 rounded hover:bg-red-500/10 text-red-400 cursor-pointer transition disabled:opacity-40"
                        onClick={
                          isHistorySelectionMode
                            ? () => {
                                if (selectedHistoryItems.length > 0) {
                                  setShowDeleteSelectedModal(true);
                                } else {
                                  setShowClearModal(true);
                                }
                              }
                            : toggleHistorySelectionMode
                        }
                        disabled={readingHistory.length === 0}
                        title={
                          isHistorySelectionMode
                            ? selectedHistoryItems.length > 0
                              ? `Supprimer ${selectedHistoryItems.length} élément(s)`
                              : "Vider tout l'historique"
                            : "Sélectionner pour supprimer"
                        }
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </div>

                  {loadingHistory ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400">Chargement...</div>
                    </div>
                  ) : errorHistory ? (
                    <div className="text-center py-8">
                      <div className="text-red-400">{errorHistory}</div>
                    </div>
                  ) : readingHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400">
                        Aucune lecture récente.
                      </div>
                    </div>
                  ) : (
                    <div
                      className="grid gap-4 overflow-y-auto max-h-[500px] w-full"
                      style={{
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(140px, 1fr))",
                      }}
                    >
                      {readingHistory.map((entry, index) => {
                        let displayTitle =
                          entry.mangaTitle && entry.mangaTitle !== "Manga"
                            ? entry.mangaTitle
                            : "Titre inconnu";
                        let clampedTitle = displayTitle;
                        if (clampedTitle.length > 32) {
                          clampedTitle = clampedTitle.slice(0, 29) + "…";
                        }
                        let coverUrl =
                          entry.coverImage || coversMap[entry.mangaId];
                        const showPlaceholder = index === 0 || !coverUrl;

                        return (
                          <div
                            key={entry.chapterId + index}
                            className="flex flex-col items-center gap-2 w-full group relative"
                            title={entry.mangaTitle || "Titre inconnu"}
                          >
                            {/* Checkbox de sélection */}
                            {isHistorySelectionMode && (
                              <div className="absolute top-2 left-2 z-20">
                                <input
                                  type="checkbox"
                                  checked={selectedHistoryItems.includes(
                                    entry.mangaId
                                  )}
                                  onChange={() =>
                                    toggleHistoryItemSelection(entry.mangaId)
                                  }
                                  className="w-5 h-5 accent-accent cursor-pointer"
                                />
                              </div>
                            )}

                            <Link
                              to={
                                "/Comics/" +
                                entry.mangaId +
                                "/" +
                                (entry.mangaSlug || "")
                              }
                              className={`flex flex-col items-center gap-2 w-full ${
                                isHistorySelectionMode
                                  ? "pointer-events-none"
                                  : ""
                              }`}
                              onClick={
                                isHistorySelectionMode
                                  ? (e) => e.preventDefault()
                                  : undefined
                              }
                            >
                              <div className="w-[120px] h-[180px] bg-gray-700 overflow-hidden shadow rounded-lg transition-transform group-hover:scale-105 relative">
                                {coverUrl && !showPlaceholder ? (
                                  <img
                                    src={coverUrl}
                                    alt={clampedTitle}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.style.display = "none";
                                      const placeholder =
                                        e.target.parentNode.querySelector(
                                          ".cover-placeholder"
                                        );
                                      if (placeholder)
                                        placeholder.style.display = "flex";
                                    }}
                                  />
                                ) : null}
                                <motion.div
                                  className="cover-placeholder absolute inset-0 flex items-center justify-center bg-gray-200 z-10"
                                  style={{
                                    display: showPlaceholder ? "flex" : "none",
                                  }}
                                  initial={{ opacity: 0.7 }}
                                  animate={{ opacity: [0.7, 1, 0.7] }}
                                  transition={{
                                    duration: 1.2,
                                    repeat: Infinity,
                                  }}
                                >
                                  <motion.div
                                    className="w-12 h-12 border-4 border-gray-300 border-t-accent rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 1,
                                      ease: "linear",
                                    }}
                                  />
                                </motion.div>
                                <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col justify-end p-2">
                                  <span
                                    className="font-semibold text-white text-sm line-clamp-2 w-full"
                                    style={{
                                      display: "-webkit-box",
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: "vertical",
                                      overflow: "hidden",
                                    }}
                                  >
                                    {clampedTitle}
                                  </span>
                                  <span className="text-xs text-white text-left w-full">
                                    Chapitre {entry.chapterNumber}
                                    {entry.chapterTitle
                                      ? ` : ${entry.chapterTitle}`
                                      : ""}
                                  </span>
                                  <span className="text-xs text-gray-200 text-left w-full">
                                    {entry.readAt
                                      ? new Date(entry.readAt).toLocaleString(
                                          "fr-FR",
                                          {
                                            dateStyle: "short",
                                            timeStyle: "short",
                                          }
                                        )
                                      : ""}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "securite" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-accent mb-4">
                    Sécurité du compte
                  </h3>

                  <form onSubmit={handleSave} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Mot de passe actuel
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={form.currentPassword || ""}
                        onChange={handleChange}
                        className={`w-full border rounded-lg px-4 py-3 transition-colors ${
                          isEditing
                            ? "bg-gray-800 border-gray-700 text-white focus:border-accent focus:ring-1 focus:ring-accent cursor-pointer"
                            : "bg-gray-900/50 border-gray-600 text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!isEditing}
                        placeholder="Votre mot de passe actuel"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className={`w-full border rounded-lg px-4 py-3 transition-colors ${
                          isEditing
                            ? "bg-gray-800 border-gray-700 text-white focus:border-accent focus:ring-1 focus:ring-accent cursor-pointer"
                            : "bg-gray-900/50 border-gray-600 text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!isEditing}
                        placeholder="Laissez vide pour ne pas changer"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Le mot de passe doit contenir au moins 5 caractères
                      </p>
                    </div>

                    {isEditing && (
                      <div className="flex space-x-3 pt-4">
                        <button
                          type="button"
                          className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition cursor-pointer"
                          onClick={handleCancel}
                          disabled={loading}
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-accent text-dark-bg rounded-lg font-medium hover:bg-accent/80 transition cursor-pointer"
                          disabled={loading}
                        >
                          {loading
                            ? "Sauvegarde..."
                            : "Changer le mot de passe"}
                        </button>
                      </div>
                    )}

                    {!isEditing && (
                      <div className="pt-4">
                        <button
                          type="button"
                          className="px-6 py-2 bg-accent text-dark-bg rounded-lg font-medium hover:bg-accent/80 transition cursor-pointer"
                          onClick={handleEdit}
                        >
                          Modifier le mot de passe
                        </button>
                      </div>
                    )}
                  </form>

                  {/* Section suppression de compte */}
                  <div className="border-t border-gray-700 pt-6 mt-8">
                    <h4 className="text-lg font-semibold text-red-400 mb-4">
                      Zone dangereuse
                    </h4>
                    <p className="text-gray-400 text-sm mb-4">
                      Une fois votre compte supprimé, il n'y a pas de retour en
                      arrière possible. Toutes vos données seront définitivement
                      perdues.
                    </p>
                    <button
                      className="px-6 py-2 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/10 transition font-medium cursor-pointer"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Supprimer le compte
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modals et modales */}

      {/* Modal de confirmation pour vider l'historique */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-dark-bg rounded-lg shadow-lg p-6 w-full max-w-xs flex flex-col items-center relative">
            <span className="text-lg font-bold text-accent mb-2">
              Confirmer la suppression
            </span>
            <p className="text-white mb-4 text-center">
              Voulez-vous vraiment vider tout votre historique de lecture ?
            </p>
            <div className="flex gap-3 w-full">
              <button
                className="flex-1 px-3 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition cursor-pointer"
                onClick={() => setShowClearModal(false)}
              >
                Annuler
              </button>
              <button
                className="flex-1 px-3 py-2 rounded bg-red-600 text-white font-bold hover:bg-red-700 transition cursor-pointer"
                onClick={handleClearHistory}
              >
                Vider
              </button>
            </div>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold z-10 cursor-pointer"
              onClick={() => setShowClearModal(false)}
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Modale de validation du changement d'email */}
      <AnimatePresence>
        {showEmailModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={() => setShowEmailModal(false)}
          >
            <motion.div
              className="relative"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.2 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold z-10 cursor-pointer"
                onClick={() => setShowEmailModal(false)}
                aria-label="Fermer"
              >
                ×
              </button>
              <div className="bg-dark-bg rounded-lg shadow-lg p-6 w-full max-w-md flex flex-col items-center relative">
                <span className="text-lg font-bold text-accent mb-2">
                  Confirmer le changement d'email
                </span>
                <p className="text-white mb-4 text-center">
                  Voulez-vous vraiment changer votre email de{" "}
                  <strong>{censorEmail(form.email)}</strong> vers{" "}
                  <strong>{form.newEmail}</strong> ?
                </p>
                <div className="w-full max-w-xs flex gap-2">
                  <button
                    type="button"
                    className="w-full border border-gray-400 text-gray-400 py-2 rounded cursor-pointer font-medium hover:text-white hover:bg-gray-500 transition"
                    onClick={() => setShowEmailModal(false)}
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    className="w-full border border-accent text-accent py-2 rounded cursor-pointer font-medium hover:bg-accent-hover transition hover:text-white"
                    onClick={() => {
                      // Ici on peut ajouter la logique pour changer l'email
                      setShowEmailModal(false);
                      setIsEditing(false);
                      // Reset des champs email
                      setForm((prev) => ({
                        ...prev,
                        currentEmail: "",
                        newEmail: "",
                      }));
                    }}
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de suppression de compte (1) */}
      <AnimatePresence>
        {showDeleteModal && !showFinalDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <motion.div
              className="relative"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.2 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold z-10 cursor-pointer"
                onClick={() => setShowDeleteModal(false)}
                aria-label="Fermer"
              >
                ×
              </button>
              <div className="bg-dark-bg rounded-lg shadow-lg p-6 w-full max-w-xs flex flex-col items-center relative">
                <span className="text-lg font-bold text-accent mb-2">
                  Supprimer mon compte
                </span>
                <p className="text-white mb-4 text-center">
                  Pour confirmer la suppression, tape{" "}
                  <span className="text-red-400 font-bold">supprimer</span>{" "}
                  ci-dessous.
                </p>
                <input
                  type="text"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-white text-black mb-4"
                  placeholder="supprimer"
                  autoFocus
                />
                <div className="flex gap-2 w-full">
                  <button
                    className="flex-1 px-3 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition cursor-pointer"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Annuler
                  </button>
                  <button
                    className="flex-1 px-3 py-2 rounded bg-red-600 text-white font-bold hover:bg-red-700 transition cursor-pointer"
                    onClick={() => {
                      if (deleteInput === "supprimer") {
                        setShowDeleteModal(false);
                        setShowFinalDeleteModal(true);
                      }
                    }}
                    disabled={deleteInput !== "supprimer"}
                  >
                    Valider
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de suppression de compte (2) */}
      <AnimatePresence>
        {showFinalDeleteModal && !showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <motion.div
              className="relative"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.2 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold z-10 cursor-pointer"
                onClick={() => {
                  setShowFinalDeleteModal(false);
                  setShowDeleteModal(true);
                }}
                aria-label="Fermer"
              >
                ×
              </button>
              <div className="bg-dark-bg rounded-lg shadow-lg p-6 w-full max-w-xs flex flex-col items-center relative">
                <span className="text-lg font-bold text-accent mb-2">
                  Confirmation finale
                </span>
                <p className="text-white mb-4 text-center">
                  Es-tu sûr de vouloir{" "}
                  <span className="text-red-400 font-bold">
                    supprimer définitivement
                  </span>{" "}
                  ton compte ?<br />
                  Cette action est irréversible.
                </p>
                <div className="flex gap-2 w-full">
                  <button
                    className="flex-1 px-3 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition cursor-pointer"
                    onClick={() => {
                      setShowFinalDeleteModal(false);
                      setShowDeleteModal(true);
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    className="flex-1 px-3 py-2 rounded bg-red-600 text-white font-bold hover:bg-red-700 transition cursor-pointer"
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? "Suppression..." : "Supprimer"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de confirmation pour supprimer la sélection */}
      {showDeleteSelectedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-dark-bg rounded-lg shadow-lg p-6 w-full max-w-xs flex flex-col items-center relative">
            <span className="text-lg font-bold text-accent mb-2">
              Confirmer la suppression
            </span>
            <p className="text-white mb-4 text-center">
              Voulez-vous vraiment supprimer {selectedHistoryItems.length} manga
              {selectedHistoryItems.length > 1 ? "s" : ""} de votre historique ?
            </p>
            <div className="flex gap-3 w-full">
              <button
                className="flex-1 px-3 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition cursor-pointer"
                onClick={() => setShowDeleteSelectedModal(false)}
              >
                Annuler
              </button>
              <button
                className="flex-1 px-3 py-2 rounded bg-red-600 text-white font-bold hover:bg-red-700 transition cursor-pointer"
                onClick={handleDeleteSelectedHistory}
              >
                Supprimer
              </button>
            </div>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold z-10 cursor-pointer"
              onClick={() => setShowDeleteSelectedModal(false)}
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
