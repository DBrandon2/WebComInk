require("dotenv").config();

module.exports = {
  key: process.env.PRIVATE_KEY,
  keyPub: process.env.PUBLIC_KEY,
};
