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
  getFavorites,
  updateFavoriteStatus,
  saveFavoritesOrder,
  getCustomCategories,
  addCustomCategory,
  removeCustomCategory,
  renameCustomCategory,
} = require("../controllers/user.controller");

const router = require("express").Router();

// POST
router.post("/register", signup);
router.post("/login", signin);
router.post("/favorites", addFavorite);
router.post("/custom-categories", addCustomCategory);

// GET
router.get("/currentUser", currentUser);
router.get("/verifyMail/:token", verifyMail);
router.get("/favorites", getFavorites);
router.get("/custom-categories", getCustomCategories);

// PUT
router.put("/", updateUser);
router.put("/avatar", updateAvatar);
router.put("/favorites/status", updateFavoriteStatus);
router.put("/favorites/order", saveFavoritesOrder);
router.put("/custom-categories", renameCustomCategory);

// DELETE
router.delete("/deleteToken", logoutUser);
router.delete("/favorites/:mangaId", removeFavorite);
router.delete("/custom-categories", removeCustomCategory);

module.exports = router;

// localhost:3000/user
