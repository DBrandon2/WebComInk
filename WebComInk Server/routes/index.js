const router = require("express").Router();

const apiUsers = require("./user.route");
const apiMangas = require("./manga.route");
const apiComments = require("./comment.route");
const proxyRouter = require("../api/proxy");

router.use("/user", apiUsers);

router.use("/manga", apiMangas);

router.use("/comments", apiComments);

router.use("/proxy", proxyRouter);

module.exports = router;

// localhost:3000
