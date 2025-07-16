const User = require("../models/user.schema");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const {
  sendConfirmationEmail,
  sendValidationAccount,
  sendInvalidEmailToken,
} = require("../email/email");
const TempUser = require("../models/tempuser.schema");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");

const SECRET_KEY = process.env.SECRET_KEY;

const createTokenEmail = (email) => {
  return jsonwebtoken.sign({ email }, process.env.SECRET_KEY, {
    expiresIn: "60s",
  });
};

const signup = async (req, res) => {
  console.log(req.body);
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Déjà inscrit" });
    }
    const token = createTokenEmail(email);
    await sendConfirmationEmail(email, token);
    const tempUser = new TempUser({
      username,
      email,
      password: await bcrypt.hash(password, 10),
      token,
    });
    await tempUser.save();
    res.status(201).json({
      messageOk:
        "Veulliez confirmer votre en inscription en consultant votre boite mail",
    });
  } catch (error) {
    console.log(error);
  }
};

const verifyMail = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jsonwebtoken.verify(token, process.env.SECRET_KEY);
    const tempUser = await TempUser.findOne({ email: decoded.email, token });
    if (!tempUser) {
      return res.redirect(`${process.env.CLIENT_URL}/register?message=error`);
    }
    const newUser = new User({
      username: tempUser.username,
      email: tempUser.email,
      password: tempUser.password,
      customCategories: ["En cours", "En pause", "À lire", "Lu"],
    });
    await newUser.save();
    await TempUser.deleteOne({ email: tempUser.email });
    await sendValidationAccount(tempUser.email);
    res.redirect(`${process.env.CLIENT_URL}/login?message=success`);
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      const tempUser = await TempUser.findOne({ token });
      if (tempUser) {
        await tempUser.deleteOne({ token });
        await sendInvalidEmailToken(tempUser.email);
      }
      return res.redirect(`${process.env.CLIENT_URL}/register?message=error`);
    }
    console.log(error);
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email et/ou mot de passe incorrect" });
    }
    if (await bcrypt.compare(password, user.password)) {
      const { password: _, ...userWithoutPassword } = user.toObject();
      const token = jsonwebtoken.sign({}, SECRET_KEY, {
        subject: user._id.toString(),
        expiresIn: "7d",
        algorithm: "HS256",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json(userWithoutPassword);
    } else {
      res.status(400).json({ message: "Email et/ou mot de passe incorrect" });
    }
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (req, res) => {
  console.log(req.body);
  try {
    const { _id, username, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        username,
        email,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
  }
};

const updateAvatar = async (req, res) => {
  console.log(req.body);
  try {
    const { _id, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        avatar,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
  }
};

const currentUser = async (req, res) => {
  const { token } = req.cookies;
  console.log(token);
  if (token) {
    try {
      const decodedToken = jsonwebtoken.verify(token, SECRET_KEY);

      const currentUser = await User.findById(decodedToken.sub);
      if (currentUser) {
        res.status(200).json(currentUser);
      } else {
        res.json(null);
      }
    } catch (error) {
      res.json(null);
    }
  } else {
    res.json(null);
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });
  res.status(200).json({ message: "Déconnexion réussie" });
};

const addFavorite = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const decodedToken = jsonwebtoken.verify(token, SECRET_KEY);
    const userId = decodedToken.sub;

    const { mangaId, title, coverImage, status } = req.body;

    // LOG : coverImage reçu
    console.log("[addFavorite] coverImage reçu :", coverImage);

    if (!mangaId || !title) {
      return res.status(400).json({ message: "Données manquantes" });
    }

    const user = await User.findById(userId);

    // Vérifier si le manga est déjà dans les favoris
    const existingFavorite = user.favorites.find(
      (fav) => fav.mangaId === mangaId
    );
    if (existingFavorite) {
      return res
        .status(400)
        .json({ message: "Ce manga est déjà dans vos favoris" });
    }

    // Déterminer la catégorie cible
    let categoryToUse = status;
    if (!categoryToUse || !user.customCategories.includes(categoryToUse)) {
      // Utiliser la première catégorie disponible ou "En cours" par défaut
      categoryToUse =
        user.customCategories.length > 0
          ? user.customCategories[0]
          : "En cours";
    }

    // Ajouter aux favoris
    user.favorites.push({
      mangaId,
      title,
      coverImage,
      addedAt: new Date(),
      status: categoryToUse,
    });

    await user.save();

    res
      .status(200)
      .json({ message: "Manga ajouté aux favoris", favorites: user.favorites });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const decodedToken = jsonwebtoken.verify(token, SECRET_KEY);
    const userId = decodedToken.sub;

    const { mangaId } = req.params;

    const user = await User.findById(userId);

    // Filtrer les favoris pour retirer celui avec l'ID spécifié
    user.favorites = user.favorites.filter((fav) => fav.mangaId !== mangaId);

    await user.save();

    res
      .status(200)
      .json({ message: "Manga retiré des favoris", favorites: user.favorites });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getFavorites = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const decodedToken = jsonwebtoken.verify(token, SECRET_KEY);
    const userId = decodedToken.sub;

    const user = await User.findById(userId);

    // LOG : favoris renvoyés
    console.log("[getFavorites] Favoris renvoyés :", user.favorites);

    res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const updateFavoriteStatus = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const decodedToken = jsonwebtoken.verify(token, SECRET_KEY);
    const userId = decodedToken.sub;

    const { mangaId, newStatus } = req.body;

    if (!mangaId || !newStatus) {
      return res.status(400).json({ message: "Données manquantes" });
    }

    const user = await User.findById(userId);

    // Vérifier que la nouvelle catégorie existe
    if (!user.customCategories.includes(newStatus)) {
      return res.status(400).json({ message: "Catégorie inexistante" });
    }

    // Trouver et mettre à jour le favori
    const favoriteIndex = user.favorites.findIndex(
      (fav) => fav.mangaId === mangaId
    );

    if (favoriteIndex === -1) {
      return res.status(404).json({ message: "Favori non trouvé" });
    }

    user.favorites[favoriteIndex].status = newStatus;
    await user.save();

    res.status(200).json({
      message: "Statut mis à jour",
      favorites: user.favorites,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Sauvegarder l'ordre des favoris pour une catégorie
const saveFavoritesOrder = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Non autorisé" });
    }
    const decodedToken = jsonwebtoken.verify(token, SECRET_KEY);
    const userId = decodedToken.sub;
    const { category, mangaIds } = req.body;
    if (!Array.isArray(mangaIds) || !category) {
      return res.status(400).json({ message: "Paramètres invalides" });
    }
    const user = await User.findById(userId);
    // On sépare les favoris de la catégorie concernée et les autres
    const inCategory = user.favorites.filter(
      (fav) => (fav.status || "En cours") === category
    );
    const others = user.favorites.filter(
      (fav) => (fav.status || "En cours") !== category
    );
    // On réordonne les favoris de la catégorie selon mangaIds
    const reordered = mangaIds
      .map((id, idx) => {
        const fav = inCategory.find((fav) => fav.mangaId === id);
        if (fav) fav.order = idx; // Met à jour l'ordre
        return fav;
      })
      .filter(Boolean);
    user.favorites = [...others, ...reordered];
    await user.save();
    res
      .status(200)
      .json({ message: "Ordre sauvegardé", favorites: user.favorites });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// --- Catégories personnalisées ---
const getCustomCategories = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: "Non autorisé" });
    const decodedToken = jsonwebtoken.verify(token, SECRET_KEY);
    const user = await User.findById(decodedToken.sub);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.status(200).json(user.customCategories || []);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const addCustomCategory = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: "Non autorisé" });
    const decodedToken = jsonwebtoken.verify(token, SECRET_KEY);
    const user = await User.findById(decodedToken.sub);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    const { category } = req.body;
    if (!category || typeof category !== "string" || !category.trim()) {
      return res.status(400).json({ message: "Nom de catégorie invalide" });
    }
    if (user.customCategories.includes(category)) {
      return res.status(400).json({ message: "Catégorie déjà existante" });
    }
    user.customCategories.push(category);
    await user.save();
    res.status(201).json(user.customCategories);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const removeCustomCategory = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: "Non autorisé" });
    const decodedToken = jsonwebtoken.verify(token, SECRET_KEY);
    const user = await User.findById(decodedToken.sub);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    const { category } = req.body;
    if (!category || typeof category !== "string") {
      return res.status(400).json({ message: "Nom de catégorie invalide" });
    }
    if ((user.customCategories || []).length <= 1) {
      return res.status(400).json({
        message:
          "Vous devez conserver au moins une catégorie dans votre bibliothèque.",
      });
    }

    // Suppression de la catégorie "non-classé"
    if (category === "non-classé") {
      // Supprimer tous les favoris qui ont ce statut
      user.favorites = user.favorites.filter(
        (fav) => fav.status !== "non-classé"
      );
      user.customCategories = user.customCategories.filter(
        (cat) => cat !== "non-classé"
      );
      await user.save();
      return res.status(200).json(user.customCategories);
    }

    // Sinon, déplacer les mangas dans "non-classé"
    // Créer la catégorie si besoin
    if (!user.customCategories.includes("non-classé")) {
      user.customCategories.push("non-classé");
    }
    user.favorites = user.favorites.map((fav) =>
      fav.status === category ? { ...fav, status: "non-classé" } : fav
    );
    user.customCategories = user.customCategories.filter(
      (cat) => cat !== category
    );

    // Si "non-classé" ne contient plus aucun manga, la retirer
    const hasUnclassified = user.favorites.some(
      (fav) => fav.status === "non-classé"
    );
    if (!hasUnclassified) {
      user.customCategories = user.customCategories.filter(
        (cat) => cat !== "non-classé"
      );
    }

    await user.save();
    res.status(200).json(user.customCategories);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const renameCustomCategory = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: "Non autorisé" });
    const decodedToken = jsonwebtoken.verify(token, SECRET_KEY);
    const user = await User.findById(decodedToken.sub);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    const { oldCategory, newCategory } = req.body;
    if (
      !oldCategory ||
      !newCategory ||
      typeof oldCategory !== "string" ||
      typeof newCategory !== "string" ||
      !newCategory.trim()
    ) {
      return res.status(400).json({ message: "Nom de catégorie invalide" });
    }
    if (!user.customCategories.includes(oldCategory)) {
      return res
        .status(400)
        .json({ message: "Catégorie à renommer introuvable" });
    }
    if (user.customCategories.includes(newCategory)) {
      return res
        .status(400)
        .json({ message: "Une catégorie avec ce nom existe déjà" });
    }
    // Mettre à jour les catégories personnalisées
    user.customCategories = user.customCategories.map((cat) =>
      cat === oldCategory ? newCategory : cat
    );

    // Mettre à jour le statut des favoris qui utilisent l'ancienne catégorie
    user.favorites = user.favorites.map((fav) =>
      fav.status === oldCategory ? { ...fav, status: newCategory } : fav
    );

    await user.save();
    res.status(200).json(user.customCategories);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Demande de changement d'email
const requestEmailChange = async (req, res) => {
  const { _id, newEmail, password } = req.body;
  try {
    const user = await User.findById(_id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ message: "Mot de passe incorrect" });
    // Génère un token unique
    const token = crypto.randomBytes(32).toString("hex");
    user.pendingEmail = newEmail;
    user.pendingEmailToken = token;
    await user.save();
    await sendConfirmationEmail(newEmail, token);
    res.status(200).json({ message: "Un email de confirmation a été envoyé." });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Confirmation du changement d'email
const confirmEmailChange = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ pendingEmailToken: token });
    if (!user || !user.pendingEmail) {
      return res.redirect(`${process.env.CLIENT_URL}/profile?email=error`);
    }
    // Applique le nouvel email
    user.email = user.pendingEmail;
    user.pendingEmail = null;
    user.pendingEmailToken = null;
    await user.save();
    return res.redirect(`${process.env.CLIENT_URL}/profile?email=success`);
  } catch (err) {
    return res.redirect(`${process.env.CLIENT_URL}/profile?email=error`);
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { userId, confirmationWord } = req.body;

    // Vérifier le mot de confirmation
    if (confirmationWord !== "SUPPRIMER") {
      return res.status(400).json({
        message:
          "Mot de confirmation incorrect. Veuillez taper 'SUPPRIMER' pour confirmer.",
      });
    }

    // Vérifier que l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Supprimer l'utilisateur (cela supprimera aussi les favoris et catégories grâce aux références)
    await User.findByIdAndDelete(userId);

    // Nettoyer le cookie de session
    res.clearCookie("token");

    res.status(200).json({
      message: "Compte supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du compte:", error);
    res.status(500).json({
      message: "Erreur serveur lors de la suppression du compte",
    });
  }
};

// --- Historique de lecture ---
const markChapterAsRead = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const decodedToken = jsonwebtoken.verify(token, SECRET_KEY);
    const userId = decodedToken.sub;

    const {
      mangaId,
      mangaTitle,
      mangaSlug,
      coverImage,
      chapterId,
      chapterNumber,
      chapterTitle,
      progress = 100,
    } = req.body;

    if (!mangaId || !mangaTitle || !mangaSlug || !chapterId || !chapterNumber) {
      return res.status(400).json({ message: "Données manquantes" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier si ce chapitre est déjà dans l'historique
    const existingEntryIndex = user.readingHistory.findIndex(
      (entry) => entry.chapterId === chapterId
    );

    const readingEntry = {
      mangaId,
      mangaTitle,
      mangaSlug,
      coverImage,
      chapterId,
      chapterNumber,
      chapterTitle: chapterTitle || "",
      readAt: new Date(),
      progress,
    };

    if (existingEntryIndex !== -1) {
      // Mettre à jour l'entrée existante
      user.readingHistory[existingEntryIndex] = readingEntry;
    } else {
      // Ajouter une nouvelle entrée au début
      user.readingHistory.unshift(readingEntry);
    }

    // Limiter l'historique à 50 entrées pour éviter une croissance excessive
    if (user.readingHistory.length > 50) {
      user.readingHistory = user.readingHistory.slice(0, 50);
    }

    await user.save();

    res.status(200).json({
      message: "Chapitre marqué comme lu",
      readingHistory: user.readingHistory,
    });
  } catch (error) {
    console.error("Erreur lors du marquage du chapitre:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getReadingHistory = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const decodedToken = jsonwebtoken.verify(token, SECRET_KEY);
    const userId = decodedToken.sub;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Trier par date de lecture (plus récent en premier)
    const sortedHistory = user.readingHistory.sort(
      (a, b) => new Date(b.readAt) - new Date(a.readAt)
    );

    res.status(200).json({ readingHistory: sortedHistory });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getLastReadChapter = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const decodedToken = jsonwebtoken.verify(token, SECRET_KEY);
    const userId = decodedToken.sub;
    const { mangaId } = req.params;

    if (!mangaId) {
      return res.status(400).json({ message: "ID du manga manquant" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Trouver le dernier chapitre lu pour ce manga
    const lastReadChapter = user.readingHistory
      .filter((entry) => entry.mangaId === mangaId)
      .sort((a, b) => new Date(b.readAt) - new Date(a.readAt))[0];

    res.status(200).json({ lastReadChapter: lastReadChapter || null });
  } catch (error) {
    console.error("Erreur lors de la récupération du dernier chapitre:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const clearReadingHistory = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Non autorisé" });
    }
    const decodedToken = jsonwebtoken.verify(token, SECRET_KEY);
    const userId = decodedToken.sub;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    user.readingHistory = [];
    await user.save();
    res.status(200).json({ message: "Historique vidé" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'historique:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  signup,
  signin,
  updateUser,
  updateAvatar,
  currentUser,
  logoutUser,
  verifyMail,
  addFavorite,
  removeFavorite,
  getFavorites,
  updateFavoriteStatus,
  saveFavoritesOrder,
  getCustomCategories,
  addCustomCategory,
  removeCustomCategory,
  renameCustomCategory,
  requestEmailChange,
  confirmEmailChange,
  deleteAccount,
  markChapterAsRead,
  getReadingHistory,
  getLastReadChapter,
  clearReadingHistory,
};
