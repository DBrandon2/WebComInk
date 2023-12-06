const express = require("express");
// const bodyParser = require("body-parser");
const path = require("path")
const cookie = require("cookie-parser")
const cors = require('cors');



const app = express();

app.use(cors());

app.use(express.json()); // !!! Peut poser problème !!!

app.use(cookie());

app.use(express.static(path.join(__dirname, "upload")))
app.use(express.static(path.join(__dirname, "uploadResized")))


// app.use(bodyParser.json({ limit: "50mb" }));
// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const port = 8000;

require("./database");

const routes = require("./routes");

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  });
  
  app.use(routes);
  
  app.listen(port, () => {
    console.log(`serveur Node écoutant sur le port ${port}`);
  });