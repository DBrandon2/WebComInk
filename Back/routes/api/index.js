const router = require("express").Router();
const apiUsers = require("./users");

router.use("/users", apiUsers);

module.exports = router;
