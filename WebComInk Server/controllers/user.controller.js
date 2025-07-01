const User = require("../models/user.schema");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const {
  sendConfirmationEmail,
  sendValidationAccount,
  sendInvalidEmailToken,
} = require("../email/email");
const TempUser = require("../models/tempuser.schema");

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
        secure: false,
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

    const { mangaId, title, coverImage } = req.body;

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

    // Ajouter aux favoris
    user.favorites.push({
      mangaId,
      title,
      coverImage,
      addedAt: new Date(),
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

    res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    console.log(error);
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
};
