import React, { useState } from "react";
import { forgotPassword } from "../../../apis/auth.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../../assets/logo/chat-mignon-baillant-somnolent-cartoon-vector-icon-illustration-concept-icone-nature-animale-isole-vecteur-premium-style-dessin-anime-plat.png";

export default function ForgotPass() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setSent(true);
      toast.success(res.message || "Si ce mail existe, un lien a été envoyé.");
    } catch (e) {
      toast.error("Erreur lors de la demande.");
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
          Mot de passe oublié ?
        </h1>
        <p className="text-gray-200 text-base mb-6 text-center">
          Saisis ton adresse email pour recevoir un lien de réinitialisation.
        </p>
        {sent ? (
          <div className="text-accent text-center mb-4">
            Si ce mail existe, un lien a été envoyé.
            <br />
            Pense à vérifier tes spams !
          </div>
        ) : (
          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="email"
              className="w-full px-4 py-3 rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-accent text-dark-bg font-semibold py-3 rounded-lg shadow hover:bg-accent-hover transition disabled:opacity-60 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Envoi..." : "Envoyer le lien"}
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
