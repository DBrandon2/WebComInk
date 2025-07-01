import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Récupérer tous les favoris de l'utilisateur connecté
export async function getFavorites() {
  try {
    const res = await axios.get(`${API_BASE_URL}/user/favorites`, {
      withCredentials: true,
    });
    return res.data.favorites;
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris:", error);
    throw new Error(
      error.response?.data?.message ||
        "Erreur lors de la récupération des favoris"
    );
  }
}

// Ajouter un manga aux favoris
export async function addFavorite(mangaId, title, coverImage) {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/user/favorites`,
      { mangaId, title, coverImage },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout aux favoris:", error);
    throw new Error(
      error.response?.data?.message || "Erreur lors de l'ajout aux favoris"
    );
  }
}

// Supprimer un manga des favoris
export async function removeFavorite(mangaId) {
  try {
    const res = await axios.delete(
      `${API_BASE_URL}/user/favorites/${mangaId}`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    console.error("Erreur lors de la suppression des favoris:", error);
    throw new Error(
      error.response?.data?.message ||
        "Erreur lors de la suppression des favoris"
    );
  }
}

// Vérifier si un manga est dans les favoris
export async function checkIsFavorite(mangaId) {
  try {
    const favorites = await getFavorites();
    return favorites.some((fav) => fav.mangaId === mangaId);
  } catch (error) {
    console.error("Erreur lors de la vérification des favoris:", error);
    return false;
  }
}
