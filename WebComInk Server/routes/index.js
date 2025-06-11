const router = require("express").Router();


const apiUsers = require("./user.route");
const apiMangas = require("./manga.route");

router.use("/user", apiUsers);

router.use("manga", apiMangas)

module.exports = router;

// localhost:3000
