const router = require("express").Router();
const bcrypt = require("bcrypt");

const connection = require("../../database");

module.exports = router

router.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10)
    const sqlVerify = `SELECT * FROM users WHERE email=?`;

    connection.query(sqlVerify, [email], (err, result) => {
      if (err) throw err;
      if (result.length) {
        console.log("EMAIL EXISTANT");
        let isEmail = { message: "Email existant" };
        res.send(isEmail);
      } else {
        const sqlInsert =
          "INSERT INTO users (username, email, password) VALUES (?,?,?)";
        const values = [username, email, hashedPassword];
        connection.query(sqlInsert, values, (err, result) => {
          if (err) throw err;
          let idUser = result.insertId;
          console.log(idUser);
        });
        let isEmail = {
          messageGood: "Inscription réusie, vous allez être redirigé",
        };
        res.send(isEmail);
      }
    });
  } catch (error) {
    console.error(error);
  }
});

router.post("/login", (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const sql = `SELECT idUser, username, password FROM users WHERE email=?`;
    connection.query(sql, [email], async (err, result) => {
      if (err) throw err;
      if (!result.length) {
        console.log("USER INCORRECT");
        let doesExist = { message: "Email et/ou mot de passe incorrect" };
        res.send(doesExist);
      } else {
        //
        const dbPassword = result[0].password;
        const passwordMatch = await bcrypt.compare(password, dbPassword);
        if (!passwordMatch) {
          console.log("User Incorrect");
          let doesExist = { message: "User Incorrect" };
          res.send(doesExist);
        } else {
        let idUser = result[0].idUser;
        const sqlData = `SELECT username, email FROM users
          WHERE idUser =?`;
        connection.query(sqlData, [idUser], (err, result) => {
          if (err) throw err;
          console.log(result);
          res.send(JSON.stringify(result));
        });
        }
        
      }
    });
  } catch (error) {
    console.error(error);
  }
});
