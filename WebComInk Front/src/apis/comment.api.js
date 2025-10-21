const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Récupérer les commentaires d'un chapitre
export async function getCommentsByChapter(chapterId, page = 1, limit = 20) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/comments/chapter/${chapterId}?page=${page}&limit=${limit}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('getCommentsByChapter error:', error);
    throw error;
  }
}

// Créer un nouveau commentaire
export async function createComment(commentData) {
  try {
    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentData),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('createComment error:', error);
    throw error;
  }
}

// Modifier un commentaire
export async function updateComment(commentId, content) {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('updateComment error:', error);
    throw error;
  }
}

// Supprimer un commentaire
export async function deleteComment(commentId) {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('deleteComment error:', error);
    throw error;
  }
}

// Liker/Unliker un commentaire
export async function toggleLikeComment(commentId) {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}/like`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('toggleLikeComment error:', error);
    throw error;
  }
}
