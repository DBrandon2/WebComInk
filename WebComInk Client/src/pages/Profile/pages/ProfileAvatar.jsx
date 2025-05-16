import React, { useContext, useState } from "react";
import { Camera, User } from "lucide-react";
import { useRef } from "react";
import { supabase } from "../../../utils/supabaseClient";
import { updateAvatar } from "../../../apis/auth.api";
import { AuthContext } from "../../../context/AuthContext";

export default function ProfileAvatar({
  avatarUrl,
  isEditing,
  onChangeAvatar,
  id,
}) {
  // création d'une référence à l'input qui permet d'accèder à un élément du DOM sans provoquer de re render
  const inputRef = useRef(null);
  const { setUser, user } = useContext(AuthContext);

  // récupère le clic sur l'input file et ouvre l'explorateur de fichier pour choisir votre image
  const handleAvatarCLick = () => {
    console.log(inputRef);
    if (isEditing && inputRef.current) {
      inputRef.current.click();
    }
  };

  // méthode qui détecte un événement dans l'input de type file
  const handleFileChange = async (e) => {
    // récupération de l'image
    const file = e.target.files[0];
    console.log(file);
    // si pas d'image on sort de la méthode
    if (!file) return;
    try {
      // récupération de l'extension du fichier
      const fileExt = file.name.split(".").pop();
      console.log(fileExt);
      // création d'un nom aléatoire et unique pour l'image
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      // envoi du nom de fichier et de l'image sur le stockage supabase
      let { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, file);

      // gestion de la possible erreur
      if (error) throw error;

      // récupération de l'URL de l'image insérée
      const { data: url } = await supabase.storage
        .from("images")
        .getPublicUrl(fileName);

      // requête HTTP pour modifier l'avatar en BDD, l'identifiant est nécessaire à la requête dans le backend
      // on récupère l'ID depuis le contexte passé en props depuis Data
      await updateAvatar({ avatar: url.publicUrl, _id: id });

      // appel de la méthode qui met, depuis Data, le defaultProfile à jour
      onChangeAvatar(url.publicUrl);

      // récupération du localStorage pour lui ajouter l'avatar
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const updatedUser = { ...storedUser, avatar: url.publicUrl };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // mise à jour de l'utilisateur dans le provider
      setUser(updatedUser);
    } catch (error) {
      console.log(error);
    }
  };

  // on utilise soit l'url dans la bdd sinon si elle est nulle l'avatar par défaut
  const avatarSrc = user.avatar || avatarUrl;
  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative rounded-full overflow-hidden h-32 w-32 border-4 border-white shadow-lg transition duration-300 ${
          isEditing ? "cursor-pointer hover:opacity-90" : ""
        }`}
        onClick={handleAvatarCLick}
      >
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-200">
            <User size={64} className="text-gray-400" />
          </div>
        )}

        {isEditing && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
            <Camera size={36} className="text-white" />
          </div>
        )}
      </div>

      {isEditing && (
        <>
          <input
            ref={inputRef}
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <p className="text-sm text-blue-500 mt-2">Click to change avatar</p>
        </>
      )}
    </div>
  );
}
