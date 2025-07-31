import React, { useContext, useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { TbAlertTriangleFilled } from "react-icons/tb";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import { deleteAccount } from "../../apis/auth.api";
import toast from "react-hot-toast";
import CustomSelect from "../../components/shared/CustomSelect";
import { motion, AnimatePresence } from "framer-motion";
import CookieManager from "../../components/CookieManager";

// Fonction utilitaire pour supprimer toutes les clés de settings de lecture
function resetReaderSettings(mode) {
  // Supprime la clé globale
  localStorage.removeItem("readerMargin");
  // Supprime toutes les clés individuelles (pattern : readerMargin_{mangaId})
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("readerMargin_")) {
      localStorage.removeItem(key);
    }
  });
}

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { theme, font, changeTheme, changeFont } = useContext(ThemeContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFinalDeleteConfirm, setShowFinalDeleteConfirm] = useState(false);
  const [selectedImageQuality, setSelectedImageQuality] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("imageQuality") || "data";
    }
    return "data";
  });

  // Ajout pour le mode de préférences de lecture
  const [readerSettingsMode, setReaderSettingsMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("readerSettingsMode") || "global";
    }
    return "global";
  });
  const [showResetModal, setShowResetModal] = useState(false);
  const [pendingMode, setPendingMode] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("imageQuality", selectedImageQuality);
    }
  }, [selectedImageQuality]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("readerSettingsMode", readerSettingsMode);
    }
  }, [readerSettingsMode]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Déconnexion réussie");
      navigate("/");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmationText !== "SUPPRIMER") {
      toast.error("Veuillez taper 'SUPPRIMER' pour confirmer");
      return;
    }

    if (!user?._id) {
      toast.error("Utilisateur non trouvé");
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteAccount({
        userId: user._id,
        confirmationWord: confirmationText,
      });

      if (result.message) {
        toast.success(result.message);
        await logout();
        navigate("/");
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression du compte");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setConfirmationText("");
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div>
      <div className="flex items-center gap-4 m-4">
        <span className="cursor-pointer text-lg" onClick={handleBackClick}>
          <IoIosArrowBack />
        </span>
        <h1>Paramètre utilisateur</h1>
      </div>
      <div className="flex justify-center items-center">
        <span className=" h-[1px] bg-white/70 w-[90%] md:w-[95%]"></span>
      </div>
      <div className="flex flex-col gap-2 m-8">
        <h2 className="text-accent text-xl">Se déconnecter de WebComInk</h2>
        <p className="font-light text-gray-300 mb-4">
          Cliquez sur le bouton suivant, pour vous déconnecter de votre compte
          WebComInk.
        </p>
        <div className="w-full flex justify-center md:justify-start ">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white w-full py-2 rounded-md md:w-[30%] cursor-pointer hover:bg-red-600 transition-colors"
          >
            Se déconnecter
          </button>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <span className=" h-[1px] bg-white/70 w-[90%] md:w-[95%]"></span>
      </div>
      <div className="flex flex-col gap-2 m-8">
        <h2 className="text-accent text-xl">Thème du site</h2>
        <p className="font-light text-gray-300 mb-4">
          Le thème visuel du site que vous souhaitez utiliser.
        </p>
        <div className="w-full flex justify-center md:justify-start">
          <CustomSelect
            options={[
              { value: "neon", label: "Thème néon" },
              { value: "clair", label: "Thème clair" },
            ]}
            value={theme}
            onChange={changeTheme}
          />
        </div>
      </div>
      <div className="flex justify-center items-center">
        <span className=" h-[1px] bg-white/70 w-[90%] md:w-[95%]"></span>
      </div>
      <div className="flex flex-col gap-2 m-8">
        <h2 className="text-accent text-xl">Police d'écriture</h2>
        <p className="font-light text-gray-300 mb-4">
          Modifier la police d'écriture du site exclusivement. ( Cela se limite
          aux menus et interfaces du site et non des chapitres disponibles sur
          WebComInk ).
        </p>
        <div className="w-full flex justify-center md:justify-start">
          <CustomSelect
            options={[
              { value: "defaut", label: "Défaut" },
              { value: "opendyslexic", label: "OpenDyslexic" },
            ]}
            value={font}
            onChange={changeFont}
          />
        </div>
      </div>
      <div className="flex justify-center items-center">
        <span className=" h-[1px] bg-white/70 w-[90%] md:w-[95%]"></span>
      </div>
      <div className="flex flex-col gap-2 m-8">
        <h2 className="text-accent text-xl">Qualité des images de lecture</h2>
        <p className="font-light text-gray-300 mb-4">
          Choisissez la qualité des images lors de la lecture d'un manga. <br />
          <span className="text-sm text-gray-400">
            <strong>Qualité originale</strong> : images en qualité maximale.
            <br />
            <strong>Économie de données</strong> : images compressées,
            chargement plus rapide et moins de données utilisées.
          </span>
        </p>
        <div className="w-full flex justify-center md:justify-start">
          <CustomSelect
            options={[
              { value: "data", label: "Qualité originale" },
              { value: "data-saver", label: "Économie de données" },
            ]}
            value={selectedImageQuality}
            onChange={setSelectedImageQuality}
          />
        </div>
      </div>
      <div className="flex justify-center items-center">
        <span className=" h-[1px] bg-white/70 w-[90%] md:w-[95%]"></span>
      </div>
      <div className="flex flex-col gap-2 m-8">
        <h2 className="text-accent text-xl">Préférences de lecture</h2>
        <p className="font-light text-gray-300 mb-4">
          Cette option vous permet de choisir comment sont appliqués vos
          réglages de lecture (marge, mode de lecture, etc.) dans le lecteur de
          scans.
          <br />
          <span className="text-sm text-gray-400">
            <strong>Globale</strong> : vos préférences s’appliquent à tous les
            mangas, pour une expérience cohérente.
            <br />
            <strong>Par manga</strong> : vous pouvez personnaliser les réglages
            pour chaque manga individuellement (pratique pour les webtoons ou
            les formats spéciaux).
          </span>
        </p>
        <div className="w-full flex justify-center md:justify-start">
          <CustomSelect
            options={[
              { value: "global", label: "Globale" },
              { value: "per-manga", label: "Individuel" },
            ]}
            value={readerSettingsMode}
            onChange={(val) => {
              setPendingMode(val);
              setShowResetModal(true);
            }}
          />
        </div>
      </div>
      <div className="flex justify-center items-center">
        <span className=" h-[1px] bg-white/70 w-[90%] md:w-[95%]"></span>
      </div>
      <div className="flex flex-col gap-2 m-8">
        <CookieManager />
      </div>
      <div className="flex justify-center items-center">
        <span className=" h-[1px] bg-white/70 w-[90%] md:w-[95%]"></span>
      </div>
      <div className="flex flex-col gap-2 m-8">
        <h2 className="text-red-500 text-xl">Supprimer votre compte</h2>
        <p className="font-light text-gray-300 mb-4">
          Cliquer sur le bouton suivant pour supprimer votre compte WebComInk.
        </p>
        <p className="text-sm text-red-500 mb-4">
          ATTENTION ! CETTE ACTION EST IRRÉVERSIBLE ET VOTRE COMPTE SERA
          SUPPRIMÉ DE MANIÈRE PERMANENTE.
        </p>
        <div className="w-full flex justify-center md:justify-start">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-500 text-white w-full py-2 px-4 rounded-md text-start flex justify-between items-center tracking-wide md:w-[30%] cursor-pointer hover:bg-red-600 transition-colors"
          >
            <TbAlertTriangleFilled /> Supprimer votre compte{" "}
            <TbAlertTriangleFilled />
          </button>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <TbAlertTriangleFilled className="text-red-500 text-2xl" />
              <h3 className="text-lg font-semibold text-gray-900">
                Confirmer la suppression
              </h3>
            </div>

            <p className="text-gray-700 mb-4">
              Cette action est irréversible. Votre compte et toutes vos données
              seront définitivement supprimés.
            </p>

            <p className="text-sm text-gray-600 mb-4">
              Pour confirmer, tapez <strong>SUPPRIMER</strong> dans le champ
              ci-dessous :
            </p>

            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Tapez SUPPRIMER"
              className="w-full p-3 border border-gray-300 rounded-md mb-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmationText("");
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                disabled={isDeleting}
              >
                Annuler
              </button>
              <button
                onClick={() => setShowFinalDeleteConfirm(true)}
                disabled={isDeleting || confirmationText !== "SUPPRIMER"}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isDeleting ? "Suppression..." : "Supprimer définitivement"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de double confirmation */}
      {showFinalDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <TbAlertTriangleFilled className="text-red-500 text-2xl" />
              <h3 className="text-lg font-semibold text-gray-900">
                Êtes-vous sûr ?
              </h3>
            </div>
            <p className="text-gray-700 mb-4">
              Cette action est{" "}
              <span className="font-bold text-red-500">irréversible</span>.
              <br />
              Confirmez-vous la suppression définitive de votre compte ?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowFinalDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                disabled={isDeleting}
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isDeleting ? "Suppression..." : "Oui, supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'avertissement de réinitialisation des réglages de lecture */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowResetModal(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="relative bg-dark-bg rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 w-full">
                <h3 className="text-xl font-bold text-accent text-center w-full">
                  Changement du mode de préférences de lecture
                </h3>
              </div>
              {/* Content */}
              <div className="p-6 w-full">
                <p className="text-gray-300 mb-4 text-center">
                  En changeant ce mode,
                  <span className="text-accent font-semibold">
                    {" "}
                    tous vos réglages de lecture personnalisés{" "}
                  </span>
                  (marges, etc.) seront supprimés.
                  <br />
                  Vous devrez reconfigurer vos préférences lors de votre
                  prochaine lecture.
                </p>
              </div>
              {/* Footer */}
              <div className="flex gap-3 justify-center p-6 border-t border-gray-200 bg-dark-bg w-full">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400 transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    resetReaderSettings(pendingMode);
                    setReaderSettingsMode(pendingMode);
                    setShowResetModal(false);
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-accent text-dark-bg font-bold hover:bg-accent-hover hover:text-white transition cursor-pointer"
                >
                  Confirmer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
