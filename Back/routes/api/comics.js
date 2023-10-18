const router = require("express").Router();

const connection = require("../../database");

router.get("/getComics", (req, res) => {
    const sql = "SELECT * FROM series";
    connection.query(sql, (err, result) => {
        if (err) throw (err, console.log(result));
        console.log("Manga récupérées");
        res.send(JSON.stringify(result));
    })
})