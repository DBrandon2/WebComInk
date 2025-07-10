import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import defaultAvatar from "../../assets/defaultAvatar.jpg";
import { update } from "../../apis/auth.api";
import ChangeEmailForm from "./pages/ChangeEmailForm";
import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <div className="min-h-screen text-white font-sans px-4 py-6 flex flex-col md:flex-row md:items-start md:justify-center md:gap-12">
      {/* Partie gauche : Profil & Formulaire */}
      <div className="flex flex-col items-center md:items-start md:w-1/2 space-y-6">
        <h1 className="text-accent text-2xl font-bold">Profile utilisateur</h1>

        <div className="w-64 h-64 rounded-full overflow-hidden border-2 border-accent">
          <img
            src={defaultAvatar}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        <button className="border border-accent text-accent py-1 px-3 rounded  hover:bg-accent hover:text-black cursor-pointer">
          Changer d'avatar
        </button>

        <form className="w-full space-y-4" onSubmit={handleSave}>
          <div>
            <label className="text-accent text-sm">Nom d'utilisateur</label>
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
          <div>
            <label className="text-accent text-sm">Email</label>
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
          <div>
            <label className="text-accent text-sm">Mot de passe</label>
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

          {isEditing ? (
            <div className="flex gap-2">
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
            <button
              type="button"
              className="w-full border border-accent text-accent hover:text-dark-bg hover:bg-accent transition py-2 rounded cursor-pointer font-medium"
              onClick={handleEdit}
            >
              Modifier ses informations
            </button>
          )}
        </form>

        <button
          className="w-full border border-blue-500 text-blue-500 py-2 rounded font-medium hover:bg-blue-500 hover:text-white transition cursor-pointer"
          onClick={() => setShowEmailModal(true)}
        >
          Modifier mon email
        </button>

        <button
          className="hidden md:flex bg-red-500 text-white py-2 px-6 rounded hover:bg-red-700 font-semibold mt-6 md:mt-auto cursor-pointer"
          onClick={logout}
        >
          Se déconnecter
        </button>
      </div>

      {/* Partie droite : Mangas aimés */}
      <div className="mt-10 md:mt-0 md:w-1/2">
        <h2 className="text-accent text-sm mb-2 md:mt-2">
          Retrouvez les mangas que vous avez aimés !
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="w-full aspect-square bg-gray-700 rounded overflow-hidden"
            >
              <img
                src="/placeholder-manga.png"
                alt={`Manga ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <button className="mt-4 border border-yellow-400 text-yellow-400 py-1 px-3 rounded hover:bg-yellow-400 hover:text-black text-sm">
          Voir plus
        </button>
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
              <ChangeEmailForm currentEmail={user.email} userId={user._id} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
