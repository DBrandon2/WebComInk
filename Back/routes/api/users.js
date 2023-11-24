const router = require("express").Router();
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken")
const { key, keyPub } = require("../../keys")

const connection = require("../../database");

module.exports = router


router.post("/register", (req, res) => {
  const { username, email, password} = req.body;
  const verifyMailSql = "SELECT * FROM user WHERE email = ?" // vérification de l'existence du mail
  connection.query(verifyMailSql, [email], async (err, result) => {
    try {
      if ( result.length === 0) {
        // Si il n'existe pas on hashe le mdp et on insère en BDD
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertSql = 
        "INSERT INTO user (username, email, password) VALUES (?, ?, ?)";
        connection.query(
          insertSql,
          [username, email, hashedPassword],
          (err, result) => {
            if (err) throw err;
            let iduser = result.insertId; // On récupére l'id de la dernière insertion
            const sqlSelect =
              "SELECT iduser, username, email FROM user WHERE iduser = ?";
            connection.query(sqlSelect, [iduser], (err, result) => {
              // On récupère les données correspondant à cet id -> front
              if (err) throw err;
              res.json(result);
            });
          }
        );
      } else {
        res.status(400).json("Mail déjà existant")
      }
    } catch (error) {
      console.error(error)
    }
  });
});

router.post("/login", (req, res) => {
  const {email, password} = req.body
  const sqlVerify = "SELECT * FROM user WHERE email = ?";
  connection.query(sqlVerify, [email], (err, result) => {
    try {
      if (result.length > 0) {
        if (bcrypt.compareSync(password, result[0].password)) {
          const token = jsonwebtoken.sign({}, key, {
            subject: result[0].iduser.toString(),
            expiresIn: 3600 * 24 * 30,
            algorithm: "RS256",
          });
          res.cookie("token", token, { maxAge: 30 * 24 * 60 * 60 * 1000 });
          res.json(result[0]);
        } else {
          res.status(400).json("Email et/ou mot de passe incorrects");
        }
      }else {
        res.status(400).json("Email et/ou mot de passe incorrects");
      }
    } catch (error) {
      console.log(error)
    }
  })
});

router.get("/logout", (req, res) => {
  console.log("Déconnexion en cours");
  res.clearCookie("token")
  res.end()
})

router.get("/userConnected", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    try {
      const decodedToken = jsonwebtoken.verify(token, keyPub, {
        algorithms: "RS256",
      });
      const sqlSelect =
        "SELECT idUser, name, email FROM users WHERE idUser  =?";
      connection.query(sqlSelect, [decodedToken.sub], (err, result) => {
        if (err) throw err;
        const connectedUser = result[0];
        connectedUser.password = "";
        if (connectedUser) {
          console.log(connectedUser);
          res.json(connectedUser);
        } else {
          res.json(null);
        }
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.json(null);
  }
});

// router.post("/register", async (req, res) => {
//   try {
//     console.log(req.body);
//     const { username, email, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10)
//     const sqlVerify = `SELECT * FROM users WHERE email=?`;

//     connection.query(sqlVerify, [email], (err, result) => {
//       if (err) throw err;
//       if (result.length) {
//         console.log("EMAIL EXISTANT");
//         let isEmail = { message: "Email existant" };
//         res.send(isEmail);
//       } else {
//         const sqlInsert =
//           "INSERT INTO users (username, email, password) VALUES (?,?,?)";
//         const values = [username, email, hashedPassword];
//         connection.query(sqlInsert, values, (err, result) => {
//           if (err) throw err;
//           let idUser = result.insertId;
//           console.log(idUser);
//         });
//         let isEmail = {
//           messageGood: "Inscription réusie, vous allez être redirigé",
//         };
//         res.send(isEmail);
//       }
//     });
//   } catch (error) {
//     console.error(error);
//   }
// });

// router.post("/login", (req, res) => {
//   try {
//     console.log(req.body);
//     const { email, password } = req.body;
//     const sql = `SELECT idUser, username, password FROM users WHERE email=?`;
//     connection.query(sql, [email], async (err, result) => {
//       if (err) throw err;
//       if (!result.length) {
//         console.log("USER INCORRECT");
//         let doesExist = { message: "Email et/ou mot de passe incorrect" };
//         res.send(doesExist);
//       } else {
//         //
//         const dbPassword = result[0].password;
//         const passwordMatch = await bcrypt.compare(password, dbPassword);
//         if (!passwordMatch) {
//           console.log("User Incorrect");
//           let doesExist = { message: "User Incorrect" };
//           res.send(doesExist);
//         } else {
//         let idUser = result[0].idUser;
//         const sqlData = `SELECT username, email FROM users
//           WHERE idUser =?`;
//         connection.query(sqlData, [idUser], (err, result) => {
//           if (err) throw err;
//           console.log(result);
//           res.send(JSON.stringify(result));
//         });
//         }
        
//       }
//     });
//   } catch (error) {
//     console.error(error);
//   }
// });
