require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./database/config");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "https://web-com-ink.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Pas d'origine = autoriser (ex: Postman)
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, origin); // autoriser cette origine, la renvoyer en header
      } else {
        callback(new Error("Not allowed by CORS"), false); // refuser
      }
    },
    credentials: true, // si tu utilises cookies / auth
  })
);

const routes = require("./routes");

app.use(routes);

mongoose
  .connect(config.mongoDb.uri)
  .then(() => {
    console.log("Connexion MongoDB OK");
    app.listen(3000, () => {
      console.log("Serveur démarré sur le port 3000");
    });
  })
  .catch((err) => {
    console.error("Erreur connexion MongoDB:", err);
    process.exit(1);
  });
