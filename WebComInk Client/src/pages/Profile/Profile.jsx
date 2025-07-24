import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import defaultAvatar from "../../assets/defaultAvatar.jpg";
import { update, getReadingHistory } from "../../apis/auth.api";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { enrichMangas } from "../../utils/mangaUtils";
import { supabase } from "../../utils/supabaseClient";
import { updateAvatar } from "../../apis/auth.api";

export default function Profile() {
  const { user, logout, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
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
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
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

  return (
    <div className="min-h-screen text-white font-sans px-4 py-6 flex flex-col md:flex-row md:items-start md:justify-center md:gap-x-20">
      {/* Partie gauche : Profil & Formulaire */}
      <div className="flex flex-col items-center md:justify-center md:items-center w-full md:w-1/4 md:basis-1/4">
        <h1 className="text-accent text-xl font-bold">Profile utilisateur</h1>
        <div className="flex justify-around items-center w-full">
          <span className="block bg-accent h-0.5 w-3/5 my-4" />
        </div>

        <div className="flex flex-col items-center w-48 mx-auto mb-2">
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#222",
            }}
          >
            <img
              src={previewAvatar || avatar || defaultAvatar}
              alt="Avatar"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
              onClick={openAvatarFileDialog}
              className="cursor-pointer"
            />
          </div>
          <input
            type="file"
            ref={inputAvatarRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          {/* Bouton de validation d'avatar, affiché si un fichier est sélectionné */}
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
        </div>

        <form
          className="w-full flex flex-col items-center space-y-4"
          onSubmit={handleSave}
        >
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-xs flex flex-col">
              <label className="text-accent text-sm w-full text-left">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded mt-1 transition-all duration-150 bg-white ${
                  !isEditing ? "text-gray-400" : "text-black"
                }`}
                disabled={!isEditing}
                readOnly={!isEditing}
              />
            </div>
          </div>
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-xs flex flex-col">
              <label className="text-accent text-sm w-full text-left">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded mt-1 bg-white text-gray-400"
                disabled
                readOnly
              />
            </div>
          </div>
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-xs flex flex-col">
              <label className="text-accent text-sm w-full text-left">
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded mt-1 transition-all duration-150 bg-white ${
                  !isEditing ? "text-gray-400" : "text-black"
                }`}
                disabled={!isEditing}
                placeholder="***************"
              />
            </div>
          </div>

          {isEditing ? (
            <div className="w-full max-w-xs flex gap-2">
              <button
                type="button"
                className="w-full border border-gray-400 text-gray-400 py-2 rounded cursor-pointer font-medium hover:text-white hover:bg-gray-500 transition"
                onClick={handleCancel}
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="w-full border border-accent text-accent py-2 rounded cursor-pointer font-medium hover:bg-accent-hover transition hover:text-white"
                disabled={loading}
              >
                {loading ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          ) : (
            <div className="w-full max-w-xs flex flex-col items-center">
              <button
                type="button"
                className="w-full border border-accent text-accent hover:text-dark-bg hover:bg-accent transition py-2 rounded cursor-pointer font-medium mb-3"
                onClick={handleEdit}
              >
                Modifier ses informations
              </button>
            </div>
          )}
        </form>

        <button
          className="w-full max-w-xs border border-blue-500 text-blue-500 py-2 rounded font-medium hover:bg-blue-500 hover:text-white transition cursor-pointer mb-3"
          onClick={() => setShowEmailModal(true)}
        >
          Modifier mon email
        </button>

        <button
          className="hidden md:flex bg-red-500 text-white py-2 px-6 rounded hover:bg-red-700 font-semibold mt-3 md:mt-auto cursor-pointer"
          onClick={logout}
        >
          Se déconnecter
        </button>
      </div>

      {/* Partie droite : Historique manga */}
      <div className="mt-10 md:mt-0 w-full md:w-3/5 md:basis-3/5 flex flex-col items-center relative">
        <h2 className="text-accent text-lg font-bold flex items-center w-full justify-center relative">
          Historique de lecture
        </h2>
        <div className="flex justify-around items-center w-full">
          <span className="block bg-accent h-0.5 w-4/5" />
          <button
            className="p-1 sm:p-2 rounded hover:bg-red-100 text-red-500 cursor-pointer transition disabled:opacity-40"
            onClick={() => setShowClearModal(true)}
            disabled={readingHistory.length === 0}
            title="Vider l'historique"
            style={{ fontSize: 20 }}
          >
            <FaTrash />
          </button>
        </div>
        {/* Modal de confirmation */}
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
        {loadingHistory ? (
          <div className="text-gray-400">Chargement...</div>
        ) : errorHistory ? (
          <div className="text-red-400">{errorHistory}</div>
        ) : readingHistory.length === 0 ? (
          <div className="text-gray-400">Aucune lecture récente.</div>
        ) : (
          <div
            className="grid gap-3 overflow-y-auto max-h-[280px] md:max-h-[390px] w-full mx-auto px-2 py-2"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            }}
          >
            {readingHistory.map((entry, index) => {
              // Correction du titre
              let displayTitle =
                entry.mangaTitle && entry.mangaTitle !== "Manga"
                  ? entry.mangaTitle
                  : "Titre inconnu";
              // Clamp 2 lignes + limite de taille
              let clampedTitle = displayTitle;
              if (clampedTitle.length > 32) {
                clampedTitle = clampedTitle.slice(0, 29) + "…";
              }
              // Correction de la cover
              let coverUrl = entry.coverImage || coversMap[entry.mangaId];
              // On force le placeholder pour la première cover
              const showPlaceholder = index === 0 || !coverUrl;
              return (
                <Link
                  to={
                    "/Comics/" + entry.mangaId + "/" + (entry.mangaSlug || "")
                  }
                  key={entry.chapterId + index}
                  className="flex flex-col items-center gap-2 w-full"
                  title={entry.mangaTitle || "Titre inconnu"}
                >
                  <div
                    className="w-[80px] h-[120px] md:w-[120px] md:h-[180px] bg-gray-700 overflow-hidden shadow flex-shrink-0 transition-transform hover:scale-105 relative"
                    style={{ cursor: "pointer" }}
                  >
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
                          if (placeholder) placeholder.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <motion.div
                      className="cover-placeholder absolute inset-0 flex items-center justify-center bg-gray-200 z-10"
                      style={{ display: showPlaceholder ? "flex" : "none" }}
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
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
                    {/* Dégradé bas vers haut */}
                    <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col justify-end p-2">
                      <span
                        className="font-semibold text-white text-xs md:text-sm line-clamp-2 w-full"
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
                        {entry.chapterTitle ? ` : ${entry.chapterTitle}` : ""}
                      </span>
                      <span className="text-xs text-gray-200 text-left w-full">
                        {entry.readAt
                          ? new Date(entry.readAt).toLocaleString("fr-FR", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })
                          : ""}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <button
        className="flex justify-center items-center md:hidden bg-red-500 text-white py-2 px-6 rounded hover:bg-red-700 font-semibold mt-6 md:mt-auto cursor-pointer"
        onClick={logout}
      >
        Se déconnecter
      </button>

      {/* Modale de changement d'email */}
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
              <div className="bg-dark-bg rounded-lg shadow-lg p-6 w-full max-w-xs flex flex-col items-center relative">
                <span className="text-lg font-bold text-accent mb-2">
                  Modifier mon email
                </span>
                <p className="text-white mb-4 text-center">
                  Veuillez entrer votre nouveau email.
                </p>
                <form className="w-full max-w-xs flex flex-col items-center space-y-4">
                  <div className="w-full max-w-xs flex flex-col">
                    <label className="text-accent text-sm w-full text-left">
                      Nouveau email
                    </label>
                    <input
                      type="email"
                      name="newEmail"
                      className="w-full px-4 py-2 rounded mt-1 bg-white text-gray-400"
                      placeholder="Nouvel email"
                    />
                  </div>
                  <div className="w-full max-w-xs flex gap-2">
                    <button
                      type="button"
                      className="w-full border border-gray-400 text-gray-400 py-2 rounded cursor-pointer font-medium hover:text-white hover:bg-gray-500 transition"
                      onClick={() => setShowEmailModal(false)}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="w-full border border-accent text-accent py-2 rounded cursor-pointer font-medium hover:bg-accent-hover transition hover:text-white"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
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
    </div>
  );
}
