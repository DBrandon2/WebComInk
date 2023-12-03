const router = require("express").Router();
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken")
const { key, keyPub } = require("../../keys")
const nodemailer= require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const transporter = nodemailer.createTransport({
  service : "Gmail",
  auth: {
    user: "demaretzz.brandon@gmail.com",
    pass: "gdfu ofse gipr ansb"
  }
})

const connection = require("../../database");



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
      "SELECT iduser, username, email, aboutme, profilePicture FROM user WHERE iduser  = ?";
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


router.get("/changermotdepasse/:email", (req, res) => {
  console.log(req.params);
  const email = req.params.email;
  const sqlSearchMail = "SELECT * FROM user WHERE email = ?"
  connection.query(sqlSearchMail, [email], (err, result) => {
    if (err) throw err;
    if (result.length !==0) {
      const confirmLink = `http://localhost:3000/changermotdepasse?email=${email}`;
      const mailOptions = {
        from: "demaretzz.brandon@gmail.com",
        to: email,
        subject: "Mot de passe WebComInk oublié",
        text: `Cliquez sur ce lien pour modifier votre mot de passe: ${confirmLink}`
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err){
          throw err;
        }else {
          res.end();
        }
      })
    }
  })
})

router.patch("/changepassword", async (req, res) => {
  console.log(req.body)
  try{
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sqlUpdate = "UPDATE user SET password = ? ";
    const values = [hashedPassword, email ]; //Peut poser problème ?//
    connection.query(sqlUpdate, values, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Une erreur s'est produite lors du changement de mot de passe");
        return
      }
      console.log(result);
      let passwordChanged = {
        messageGood: "Le mot de passe à bien été changé"
      };
      res.json(passwordChanged)
    });
  }catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite lors du changement de mot de passe")
  }
});


// --------Multer Image site ( comics et pp )

const upload = multer ({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../../upload"));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    console.log(file);
    cb(null, true);
  },
});
// -----------------

router.post("/updateAvatar", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file || !req.file.filename) {
      return res.status(400).json({ message: "Aucun fichier d'avatar fourni" });
    }

    const avatar = req.file.filename;
    const iduser = req.user.iduser; 
    console.log("ID utilisateur reçu dans la requête:", iduser);

    if (!iduser) {
      return res.status(401).json({ message: "Utilisateur non autorisé" });
    }

    const sqlUpdate = "UPDATE user SET profilePicture = ? WHERE iduser = ?";
    const values = [avatar, iduser];

    connection.query(sqlUpdate, values, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'avatar" });
      } else {
        res.status(200).json({ message: "Avatar mis à jour avec succès" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
});



module.exports = router