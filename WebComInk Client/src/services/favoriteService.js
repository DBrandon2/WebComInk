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
export async function addFavorite(
  mangaId,
  title,
  coverImage,
  status = "en-cours"
) {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/user/favorites`,
      { mangaId, title, coverImage, status },
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

// Mettre à jour le statut d'un favori
export async function updateFavoriteStatus(mangaId, status) {
  try {
    const res = await axios.put(
      `${API_BASE_URL}/user/favorites/${mangaId}`,
      { status },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    throw new Error(
      error.response?.data?.message || "Erreur lors de la mise à jour du statut"
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

// Nouvelle fonction pour sauvegarder l'ordre des favoris dans une catégorie
export async function saveFavoritesOrder(category, mangaIds) {
  try {
    const res = await axios.put(
      `${API_BASE_URL}/user/favorites/order`,
      { category, mangaIds },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'ordre:", error);
    throw new Error(
      error.response?.data?.message || "Erreur lors de la sauvegarde de l'ordre"
    );
  }
}

// --- Catégories personnalisées ---
export async function getCustomCategories() {
  try {
    const res = await axios.get(`${API_BASE_URL}/user/custom-categories`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des catégories personnalisées:",
      error
    );
    throw new Error(
      error.response?.data?.message ||
        "Erreur lors de la récupération des catégories personnalisées"
    );
  }
}

export async function addCustomCategory(category) {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/user/custom-categories`,
      { category },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error(
      "Erreur lors de l'ajout d'une catégorie personnalisée:",
      error
    );
    throw new Error(
      error.response?.data?.message ||
        "Erreur lors de l'ajout d'une catégorie personnalisée"
    );
  }
}

export async function removeCustomCategory(category) {
  try {
    const res = await axios.delete(`${API_BASE_URL}/user/custom-categories`, {
      data: { category },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error(
      "Erreur lors de la suppression d'une catégorie personnalisée:",
      error
    );
    throw new Error(
      error.response?.data?.message ||
        "Erreur lors de la suppression d'une catégorie personnalisée"
    );
  }
}

export async function renameCustomCategory(oldCategory, newCategory) {
  try {
    const res = await axios.put(
      `${API_BASE_URL}/user/custom-categories`,
      { oldCategory, newCategory },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error(
      "Erreur lors du renommage d'une catégorie personnalisée:",
      error
    );
    throw new Error(
      error.response?.data?.message ||
        "Erreur lors du renommage de la catégorie personnalisée"
    );
  }
}
