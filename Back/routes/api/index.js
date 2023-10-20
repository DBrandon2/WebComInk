const router = require("express").Router();
const apiUsers = require("./users");
const apiComics = require("./comics")

router.use("/users", apiUsers);
router.use("/comics", apiComics);

module.exports = router;
