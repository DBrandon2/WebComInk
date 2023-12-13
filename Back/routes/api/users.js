const router = require("express").Router();
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken")
const { key, keyPub } = require("../../keys")
const nodemailer= require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require('sharp');
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
            let iduser = result.insertId;
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
          let user = result[0];
          user.password = "";
          if (!user.profilePicture) {
            user.profilePicture = "Default_Avatar.png";
          }

          res.cookie("token", token, { maxAge: 30 * 24 * 60 * 60 * 1000 });
          res.json(user);
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
      "SELECT iduser, username, email, aboutme, profilePicture, admin FROM user WHERE iduser  = ?";
      connection.query(sqlSelect, [decodedToken.sub], (err, result) => {
        if (err) throw err;
        const connectedUser = result[0];
        console.log(connectedUser)
        connectedUser.password = "";
        if (connectedUser) {
          if (!connectedUser.profilePicture) {
            connectedUser.profilePicture = "Default_Avatar.png";
          }
        } else {
          res.json(null);
        }
        res.json(connectedUser);
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
    const allowedExtensions = ["jpg", "jpeg", "png", "avif", "webp"];
    const fileExtension = file.originalname.split(".").pop().toLowerCase();
  
    if (!allowedExtensions.includes(fileExtension)) {
      return cb(new Error("Format de fichier non supporté"), false);
    }
  
    cb(null, true);
  }
});
// -----------------


router.post("/updateAvatar", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file || !req.file.filename) {
      return res.status(400).json({ message: "Aucun fichier d'avatar fourni" });
    }
    const profilePicture = req.file.filename;
    const {iduser} = req.body; 
    const originalImagePath = path.join("upload", profilePicture);
    const resizedImagePath = path.join("uploadResized", 'resized_' + profilePicture);
    await sharp(originalImagePath)
      .resize(250, 250)
      .toFile(resizedImagePath);
    const sqlUpdate = "UPDATE user SET profilePicture = ? WHERE iduser = ?";
    connection.query(sqlUpdate, ['resized_' + profilePicture, iduser], (err, result) => {
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

// ---------------------
router.delete("/deleteUser/:iduser", (req, res) => {
  const id = req.params.iduser;
  const deleteSql = "DELETE FROM user WHERE iduser = ?"
  connection.query(deleteSql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res
      .status(500)
      .json({message : "Erreur lors de la suppréssion de l'utilisateur"});
    }
    return res.json({message: "Compte supprimé"})
  });
});
// ---------------------


router.post("/insertComics", upload.fields([{ name: 'banner', maxCount: 1 }, { name: 'portrait', maxCount: 1 }]), (req, res) => {
  try {
    if (!req.files || !req.files['banner'] || !req.files['portrait'] || !req.files['banner'][0].filename || !req.files['portrait'][0].filename) {
      return res.status(400).json({ message: "Les fichiers nécessaires ne sont pas fournis." });
    }

    const banner = req.files['banner'][0].filename;
    const portrait = req.files['portrait'][0].filename;
    const { title, synopsis, author, illustrator } = req.body;

    const sqlInsert = 'INSERT INTO comics (title, banner, portrait, synopsis, author, illustrator) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(sqlInsert, [title, banner, portrait, synopsis, author, illustrator], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de l'insertion" });
      } else {
        res.status(200).json({ message: "Insertion réussie" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
});

module.exports = router