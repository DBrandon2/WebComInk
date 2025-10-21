import axios from "axios";

import { toApiUrl } from "../utils/api";

// Récupérer tous les favoris de l'utilisateur connecté
export async function getFavorites() {
  try {
    const token = localStorage.getItem("jwt_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axios.get(toApiUrl(`/user/favorites`), {
      withCredentials: true, // forcer envoi cookie et compatible token via headers
      headers,
    });
    return res.data.favorites;
  } catch {
    throw new Error("Erreur lors de la récupération des favoris");
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
      toApiUrl(`/user/favorites`),
      { mangaId, title, coverImage, status },
      { withCredentials: true }
    );
    return res.data;
  } catch {
    throw new Error("Erreur lors de l'ajout aux favoris");
  }
}

// Supprimer un manga des favoris
export async function removeFavorite(mangaId) {
  try {
    const res = await axios.delete(toApiUrl(`/user/favorites/${mangaId}`), {
      withCredentials: true,
    });
    return res.data;
  } catch {
    throw new Error("Erreur lors de la suppression des favoris");
  }
}

// Mettre à jour le statut d'un favori
export async function updateFavoriteStatus(mangaId, status) {
  try {
    const res = await axios.put(toApiUrl(`/user/favorites/${mangaId}`), { status }, { withCredentials: true });
    return res.data;
  } catch {
    throw new Error("Erreur lors de la mise à jour du statut");
  }
}

// Vérifier si un manga est dans les favoris
export async function checkIsFavorite(mangaId) {
  try {
    const favorites = await getFavorites();
    return favorites.some((fav) => fav.mangaId === mangaId);
  } catch (error) {
    return false;
  }
}

// Nouvelle fonction pour sauvegarder l'ordre des favoris dans une catégorie
export async function saveFavoritesOrder(category, mangaIds) {
  try {
    const res = await axios.put(toApiUrl(`/user/favorites/order`), { category, mangaIds }, { withCredentials: true });
    return res.data;
  } catch {
    throw new Error("Erreur lors de la sauvegarde de l'ordre");
  }
}

// --- Catégories personnalisées ---
export async function getCustomCategories() {
  try {
    const token = localStorage.getItem("jwt_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axios.get(toApiUrl(`/user/custom-categories`), {
      withCredentials: true,
      headers,
    });
    return res.data;
  } catch {
    throw new Error("Erreur lors de la récupération des catégories personnalisées");
  }
}

export async function addCustomCategory(category) {
  try {
    const res = await axios.post(toApiUrl(`/user/custom-categories`), { category }, { withCredentials: true });
    return res.data;
  } catch {
    throw new Error("Erreur lors de l'ajout d'une catégorie personnalisée");
  }
}

export async function removeCustomCategory(category) {
  try {
    const res = await axios.delete(toApiUrl(`/user/custom-categories`), { data: { category }, withCredentials: true });
    return res.data;
  } catch {
    throw new Error("Erreur lors de la suppression d'une catégorie personnalisée");
  }
}

export async function renameCustomCategory(oldCategory, newCategory) {
  try {
    const res = await axios.put(toApiUrl(`/user/custom-categories`), { oldCategory, newCategory }, { withCredentials: true });
    return res.data;
  } catch {
    throw new Error("Erreur lors du renommage de la catégorie personnalisée");
  }
}
