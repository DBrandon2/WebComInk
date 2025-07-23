import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../../apis/auth.api";
import toast from "react-hot-toast";
import logo from "../../../assets/logo/chat-mignon-baillant-somnolent-cartoon-vector-icon-illustration-concept-icone-nature-animale-isole-vecteur-premium-style-dessin-anime-plat.png";

export default function ResetPass() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Lien invalide ou expiré.");
      return;
    }
    if (password.length < 5 || password.length > 20) {
      toast.error("Le mot de passe doit faire entre 5 et 20 caractères.");
      return;
    }
    if (password !== confirm) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      const res = await resetPassword({ token, password });
      if (res.message && res.message.includes("succès")) {
        setSuccess(true);
        toast.success(res.message);
        setTimeout(() => navigate("/auth"), 2000);
      } else {
        toast.error(res.message || "Erreur lors de la réinitialisation.");
      }
    } catch (e) {
      toast.error("Erreur lors de la réinitialisation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg px-4">
      <div className="flex flex-col items-center bg-gray-800/80 rounded-2xl shadow-lg p-8 max-w-md w-full">
        <img
          src={logo}
          alt="Logo WebComInk"
          className="w-20 h-20 mb-4 drop-shadow-lg animate-bounce"
        />
        <h1 className="text-accent text-2xl font-bold mb-2 text-center">
          Nouveau mot de passe
        </h1>
        <p className="text-gray-200 text-base mb-6 text-center">
          Choisis un nouveau mot de passe pour ton compte.
        </p>
        {success ? (
          <div className="text-accent text-center mb-4">
            Mot de passe réinitialisé !<br />
            Redirection en cours...
          </div>
        ) : (
          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="password"
              className="w-full px-4 py-3 rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Nouveau mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={5}
              maxLength={20}
              autoFocus
            />
            <input
              type="password"
              className="w-full px-4 py-3 rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Confirme le mot de passe"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={5}
              maxLength={20}
            />
            <button
              type="submit"
              className="w-full bg-accent text-dark-bg font-semibold py-3 rounded-lg shadow hover:bg-accent-hover transition disabled:opacity-60 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Réinitialisation..." : "Réinitialiser"}
            </button>
          </form>
        )}
        <button
          className="mt-6 text-gray-400 hover:text-accent transition text-sm cursor-pointer"
          onClick={() => navigate("/auth")}
        >
          Retour à la connexion
        </button>
      </div>
    </div>
  );
}
