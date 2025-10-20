const router = require("express").Router();

const apiUsers = require("./user.route");
const apiMangas = require("./manga.route");
const apiComments = require("./comment.route");
const proxyRouter = require("../api/proxy");

// Route de santé pour les cold starts
router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

router.use("/user", apiUsers);

router.use("/manga", apiMangas);

router.use("/comments", apiComments);

router.use("/proxy", proxyRouter);

module.exports = router;

// localhost:3000
