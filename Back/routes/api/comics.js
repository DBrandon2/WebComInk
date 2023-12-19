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

router.get("/getChapters/:idComics", (req, res) => {
    console.log("Request received for getChapters with idComics:", req.params.idComics);
    const idComics = req.params.idComics;
    const selectChaptersSql = `SELECT * FROM chapter WHERE idComics=?`;
    connection.query(selectChaptersSql, [idComics], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            res.status(500).send("Internal Server Error");
            return;
        }
        console.log("Chapitres récupérés", result);
        res.send(JSON.stringify(result));
    });
});

router.get("/getImgChapters/:idChapter", (req, res) => {
    console.log("Request received for getImgChapters with idChapter:", req.params.idChapter);
    const idChapter = req.params.idChapter;
    const selectImgChapterSql = `SELECT * FROM imagechapter WHERE idChapter=?`;
    connection.query(selectImgChapterSql, [idChapter], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            res.status(500).send("Internal Server Error");
            return;
        }
        console.log("Chapitre image Récupérés", result);
        res.send(JSON.stringify(result));
    })
})

module.exports = router