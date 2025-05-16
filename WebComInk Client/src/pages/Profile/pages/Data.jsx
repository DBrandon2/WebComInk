import React, { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import defaultAvatar from "../../../assets/defaultAvatar.jpg";
import ProfileForm from "./ProfileForm";
import ProfileView from "./ProfileView";
import ProfileAvatar from "./ProfileAvatar";
import { update } from "../../../apis/auth.api";

export default function Data() {
  const { user, setUser } = useContext(AuthContext);
  // création d'un objet profil pour l'affichage
  const defaultProfile = {
    firstName:
      user.email.split("@")[0].charAt(0).toUpperCase() +
      user.email.split("@")[0].slice(1),
    lastName: "Doe",
    email: user.email,
    username: user.email.split("@")[0].toLowerCase(),
    bio: "Développeur à la Silicon Valley",
    jobTitle: "Développeur Full Stack",
    company: "Google",
    location: "San Francisco, CA",
    website: "https://cda25.com",
    avatarUrl: defaultAvatar,
  };
  // attribution de cet objet à la variable d'état user
  const [profile, setProfile] = useState(defaultProfile);

  // variable qui permet de passer de la vue au formulaire de modification et vice-versa
  const [isEditing, setIsEditing] = useState(false);

  // méthodes qui permettent de switcher l'état de la variable isEditing
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // méthode qui récupère les données du formulaire (sauf avatar)
  const handleSubmit = async (data) => {
    console.log(data);
    // on ajoute l'identifiant de l'utilisateur qui est nécessaire dans le backend pour la modification
    try {
      const newData = { ...data, _id: user._id };
      // récupération de l'utilisateur modifié depuis notre call http dans le dosssier apis > auth.api.js
      const updateUser = await update(newData);
      // modification du profil local
      setProfile(newData);
      // modification du localStorage
      localStorage.setItem("user", JSON.stringify(updateUser));
      // modification de l'utilisateur dans le provider
      setUser(updateUser);
      // permet de repasser en mode affichage
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  // modifie le champ avatarUrl dans defaultProfile dès que l'avatar a été changé
  const handleChangeAvatar = (url) => {
    console.log(url);
    setProfile({ ...profile, avatarUrl: url });
  };

  console.log(defaultProfile);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-32 sm:h-48"></div>
          <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex sm:space-x-5">
                <div className="-mt-16 sm:-mt-24">
                  <ProfileAvatar
                    avatarUrl={profile.avatarUrl}
                    isEditing={isEditing}
                    onChangeAvatar={handleChangeAvatar}
                    id={user._id}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8">
              {isEditing ? (
                <ProfileForm
                  data={profile}
                  onCancel={handleCancelEdit}
                  onSubmit={handleSubmit}
                />
              ) : (
                <ProfileView data={profile} onEdit={handleEditClick} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
