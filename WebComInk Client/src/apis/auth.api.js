// import { BASE_URL } from "../utils/url";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function signin(values) {
  try {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    });
    const userConnected = await response.json();
    return userConnected;
  } catch (error) {
    console.log(error);
  }
}

export async function signup(values) {
  try {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json",
      },
    });
    const message = await response.json();
    return message;
  } catch (error) {
    console.log(error);
  }
}

export async function update(values) {
  const user = {
    _id: values._id,
    email: values.email,
    username: values.username,
  };
  try {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "PUT",
      body: JSON.stringify(user),
      headers: {
        "Content-type": "application/json",
      },
    });
    const updatedUser = await response.json();

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

export async function updateAvatar(values) {
  try {
    const response = await fetch(`${API_BASE_URL}/user/avatar`, {
      method: "PUT",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json",
      },
    });
    const updatedUserAvatar = await response.json();

    return updatedUserAvatar;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const response = await fetch(`${API_BASE_URL}/user/currentUser`, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      return await response.json();
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function signOut() {
  await fetch(`${API_BASE_URL}/user/deleteToken`, {
    method: "DELETE",
    credentials: "include",
  });
}

export async function requestEmailChange({ _id, newEmail, password }) {
  try {
    const response = await fetch(`${API_BASE_URL}/user/request-email-change`, {
      method: "POST",
      body: JSON.stringify({ _id, newEmail, password }),
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteAccount({ userId, confirmationWord }) {
  try {
    const response = await fetch(`${API_BASE_URL}/user/account`, {
      method: "DELETE",
      body: JSON.stringify({ userId, confirmationWord }),
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// --- Historique de lecture ---
export async function markChapterAsRead({
  mangaId,
  mangaTitle,
  mangaSlug,
  coverImage,
  chapterId,
  chapterNumber,
  chapterTitle,
  progress = 100,
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/user/reading-history`, {
      method: "POST",
      body: JSON.stringify({
        mangaId,
        mangaTitle,
        mangaSlug,
        coverImage,
        chapterId,
        chapterNumber,
        chapterTitle,
        progress,
      }),
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getReadingHistory() {
  try {
    const response = await fetch(`${API_BASE_URL}/user/reading-history`, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Erreur lors de la récupération de l'historique");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getLastReadChapter(mangaId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/user/last-read-chapter/${mangaId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Erreur lors de la récupération du dernier chapitre lu");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
