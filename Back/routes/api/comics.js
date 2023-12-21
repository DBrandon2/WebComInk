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

// ------------- Système de likes -------------

router.get("/getLikes/:idComics", (req, res) => {
    const idComics = req.params.idComics;
    
    const selectLikesSql = `SELECT COUNT(*) AS likeCount FROM likes WHERE idComics=? AND iduser=?`;
    connection.query(selectLikesSql, [idComics], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            res.status(500).send("Internal Server Error");
            return;
        }
        console.log("Likes récupérés", result);
        res.send(JSON.stringify(result));
    });
});

// router.post("/addLike/:idComics/:iduser", (req, res) => {
//     const idComics = req.params.idComics;
//     const iduser = req.params.iduser;
//     const checkSql = `SELECT * FROM likes WHERE idComics=? AND iduser=?`;
//     connection.query(checkSql, [idComics, iduser], (checkErr, checkResult) => {
//         if (checkErr) {
//             console.error("Error checking existing likes:", checkErr);
//             res.status(500).send("Internal Server Error");
//             return;
//         }
//         if(checkResult.length === 0) {
//             const addLikeSql = `INSERT INTO likes (idComics, iduser) VALUES (?,?)`
//             connection.query(addLikeSql, [idComics, iduser], (addErr, addResult) => {
//                 if(addErr) {
//                     console.error("Error adding likes:", addErr);
//                     res.status(500).send("Internal Server Error");
//                     return;
//                 }
//                 console.log("Like ajouté avec succès");
//                 res.send("likes ajouté avec succès")
//             });
//             const addLikeComicsSql = `UPDATE comics SET likes = likes +1 WHERE idComics=?`;
//             connection.query(addLikeComicsSql, [idComics], (addComicsErr, addComicsResult) => {
//                 if(addComicsErr){
//                     console.error("Error adding likes:", addComicsErr);
//                     res.status(500).send("Internal Sever Error");
//                     return;
//                 }
//                 console.log("Like ajouté au comics avec succès")
//                 res.send("Like ajouté au comics avec succès")
//             })
//         }else {
//             console.log("L'utilisateur à déjà aimé cette oeuvre");
//             res.status(400).send("L'utilisateur a déjà aimer cette oeuvre")
//         }
//     })
// })

router.patch("/addLike/:idComics/:iduser", (req, res) => {
    const idComics = req.params.idComics;
    const iduser = req.params.iduser;
    const checkSql = "UPDATE comics SET likes = likes + 1 WHERE idComics=?";
    connection.query(checkSql, [idComics, iduser], (err, result) => {
        if (err) throw err;
        res.end();
    });
    const postSql = "INSERT INTO likes (idComics, iduser) VALUES (?,?)";
    connection.query(postSql, [idComics, iduser], (err, result) => {
        if (err) throw err;
        res.end();
    });
});

// router.delete("/removeLike/:idComics/:iduser", (req, res) => {
//     console.log(req.params);
//     const idComics = req.params.idComics;
//     const iduser = req.params.iduser;
//     const removeLikeSql = `DELETE FROM likes WHERE idComics=? AND iduser=?`;
//     connection.query(removeLikeSql, [idComics, iduser], (removeErr, removeResult) => {
//         if (removeErr) {
//             console.error("Error removing like:", removeErr);
//             res.status(500).send("Internal Server Error");
//             return;
//         }
//         if(removeResult === 0) {
//             const removeLikeComicsSql = `UPDATE comics SET likes = likes - 1 WHERE idComics=?`;
//             connection.query(removeLikeComicsSql, [idComics], (removeComicsErr, removeComicsResult) => {
//                 if (removeComicsErr) {
//                     console.error("Error updating comics likes:", removeComicsErr);
//                     res.status(500).send("Internal Server Error");
//                     return;
//                 }
//                 console.log("Like removed successfully");
//             });
//         }
//         // res.end("Like removed successfully");
//     });
// });

router.patch("/removeLike/:idComics/:iduser", (req, res) => {
    const idComics = req.params.idComics;
    const iduser = req.params.iduser;
    const removeSql = "UPDATE comics SET likes = likes - 1 WHERE idComics=?";
    connection.query(removeSql, [idComics, iduser], (err, result) => {
        if (err) throw err;
        res.end();
    });
    const deleteSql = "DELETE FROM likes WHERE idComics=? AND iduser=?";
    connection.query(deleteSql, [idComics, iduser], (err, result) => {
        if (err) throw err;
        res.end();
    });
});


router.get("/getAllLikes/:idComics", (req, res) => {
    const idComics = req.params.idComics;
    const selectAllLikesSql = `SELECT * FROM likes WHERE idComics=?`;
    connection.query(selectAllLikesSql, [idComics], (err, result) => {
        if (err){
            console.error("Error executing SQL query:", err);
            res.status(500).send("Internal Server Error");
            return;
        }
        console.log("Tous les likes pour")
        res.send(JSON.stringify(result));
    })
})

module.exports = router