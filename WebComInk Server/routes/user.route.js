const {
  signup,
  signin,
  updateUser,
  updateAvatar,
  currentUser,
  logoutUser,
  verifyMail,
} = require("../controllers/user.controller");

const router = require("express").Router();

// POST 
router.post("/register", signup);
router.post("/login", signin);

// GET
router.get("/currentUser", currentUser);
router.get("/verifyMail/:token", verifyMail);

// PUT
router.put("/", updateUser);
router.put("/avatar", updateAvatar);

// DELETE
router.delete("/deleteToken", logoutUser);



module.exports = router;

// localhost:3000/user
