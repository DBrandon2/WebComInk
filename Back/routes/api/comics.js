const router = require("express").Router();

const connection = require("../../database/index");

router.get("/getComics", (req, res) => {
    try {
    const sql = "SELECT * FROM comics";
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Manga récupérées", result);
        res.send(JSON.stringify(result));
    });
    } catch (error) {
        console.error(error)
    }
});

router.get("/getOneComics/:idComics", (req, res) => {
    console.log(1);
    const idComics = req.params.idComics;
    const selectOneSql = `SELECT * FROM comics WHERE idComics =?`;
    connection.query(selectOneSql, [idComics], (err, result) => {
        if (err) throw err;
        console.log("Manga récupérées", result);
        res.send(JSON.stringify(result));
    });
});

module.exports = router