const {
  signup,
  signin,
  updateUser,
  updateAvatar,
  currentUser,
  logoutUser,
  verifyMail,
  addFavorite,
  removeFavorite,
  getFavorites
} = require("../controllers/user.controller");

const router = require("express").Router();

// POST 
router.post("/register", signup);
router.post("/login", signin);
router.post("/favorites", addFavorite);

// GET
router.get("/currentUser", currentUser);
router.get("/verifyMail/:token", verifyMail);
router.get("/favorites", getFavorites);

// PUT
router.put("/", updateUser);
router.put("/avatar", updateAvatar);

// DELETE
router.delete("/deleteToken", logoutUser);
router.delete("/favorites/:mangaId", removeFavorite);

module.exports = router;

// localhost:3000/user
