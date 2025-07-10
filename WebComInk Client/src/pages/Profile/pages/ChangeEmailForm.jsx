import React, { useState } from "react";
import { requestEmailChange } from "../../../apis/auth.api";

export default function ChangeEmailForm({ currentEmail, userId }) {
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) =>
    /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validateEmail(newEmail)) {
      setError("Le nouvel email n'est pas valide.");
      return;
    }
    if (newEmail !== confirmEmail) {
      setError("Les emails ne correspondent pas.");
      return;
    }
    if (!password) {
      setError("Le mot de passe est requis.");
      return;
    }
    setLoading(true);
    try {
      const res = await requestEmailChange({ _id: userId, newEmail, password });
      if (res.message && res.message.includes("confirmation")) {
        setSuccess(res.message);
        setNewEmail("");
        setConfirmEmail("");
        setPassword("");
      } else {
        setError(
          res.message || "Erreur lors de la demande de changement d'email."
        );
      }
    } catch (err) {
      setError(
        err?.message || "Erreur lors de la demande de changement d'email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-light-bg rounded-lg shadow-lg p-6 space-y-6"
    >
      <h2 className="text-xl font-bold text-accent mb-2">Changer d'email</h2>
      <div>
        <label className="block text-sm font-medium mb-1">Email actuel</label>
        <input
          type="email"
          value={currentEmail}
          disabled
          className="w-full px-4   py-2 rounded bg-gray-100 text-gray-400 border border-gray-200 "
        />
      </div>
      <div>
        <label className="block text-sm font-medium  mb-1">Nouvel email</label>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-accent focus:border-accent focus:outline-none"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium  mb-1">
          Confirmer le nouvel email
        </label>
        <input
          type="email"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
          className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-accent focus:border-accent focus:outline-none"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium  mb-1">
          Mot de passe actuel
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-accent focus:border-accent focus:outline-none"
          required
        />
      </div>
      {error && (
        <div className="text-red-500 text-sm font-semibold text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="text-green-600 text-sm font-semibold text-center">
          {success}
        </div>
      )}
      <button
        type="submit"
        className="w-full bg-accent text-dark-bg py-2 rounded font-semibold hover:bg-accent-hover hover:text-white  transition disabled:opacity-60 cursor-pointer"
        disabled={loading}
      >
        {loading ? "Envoi..." : "Changer l'email"}
      </button>
    </form>
  );
}
