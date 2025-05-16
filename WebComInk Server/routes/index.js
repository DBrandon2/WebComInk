const router = require("express").Router();

const apiUsers = require("./user.route");

router.use("/user", apiUsers);

module.exports = router;

// localhost:3000
