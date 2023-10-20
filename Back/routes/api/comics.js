const router = require("express").Router();

const connection = require("../../database/index");

router.get("/getComics", (req, res) => {
    try {
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
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

module.exports = router