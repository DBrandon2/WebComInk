import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import defaultAvatar from "../../assets/defaultAvatar.jpg";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl text-accent font-bold mb-4">Profil</h1>
        <p className="text-gray-400">Aucun utilisateur connecté.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-3xl text-accent font-bold mb-4">
        Profil utilisateur
      </h1>
      <img
        src={user.avatar || defaultAvatar}
        alt="Avatar utilisateur"
        className="w-32 h-32 rounded-full object-cover border-4 border-accent shadow-lg"
      />
      <div className="flex flex-col items-center gap-2">
        <p className="text-lg font-semibold">
          Pseudo :{" "}
          <span className="text-accent">{user.username || user.email}</span>
        </p>
        <p className="text-base text-gray-300">Email : {user.email}</p>
      </div>
      <button
        onClick={logout}
        className="mt-6 px-6 py-2 bg-accent text-dark-bg font-semibold rounded-lg shadow hover:bg-accent-hover transition"
      >
        Se déconnecter
      </button>
    </div>
  );
}
