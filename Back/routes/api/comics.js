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

// router.get("/getLikes/:idComics", (req, res) => {
//     const idComics = req.params.idComics;
    
//     const selectLikesSql = `SELECT COUNT(*) AS likeCount FROM likes WHERE idComics=? AND iduser=?`;
//     connection.query(selectLikesSql, [idComics], (err, result) => {
//         if (err) {
//             console.error("Error executing SQL query:", err);
//             res.status(500).send("Internal Server Error");
//             return;
//         }
//         console.log("Likes récupérés", result);
//         res.send(JSON.stringify(result));
//     });
// });

router.get("/getLikes/:idComics/:iduser", (req, res) => {
    const idComics = req.params.idComics;
    const iduser = req.params.iduser;
    
    const selectLikesSql = `SELECT COUNT(*) AS likeCount FROM likes WHERE idComics=? AND iduser=?`;
    connection.query(selectLikesSql, [idComics, iduser], (err, result) => {
        if (err) {
            console.error("Erreur lors de l'exécution de la requête SQL :", err);
            res.status(500).send("Erreur interne du serveur");
            return;
        }
        console.log("Likes récupérés", result);
        res.send(JSON.stringify({ likeCount: result[0].likeCount, isLiked: result[0].likeCount > 0 }));
    });
});
// ------------------------

// router.patch("/addLike/:idComics/:iduser", (req, res) => {
//     const idComics = req.params.idComics;
//     const iduser = req.params.iduser;
//     const checkSql = "UPDATE comics SET likes = likes + 1 WHERE idComics=?";
//     connection.query(checkSql, [idComics, iduser], (err, result) => {
//         if (err) throw err;
//         res.end();
//     });
//     const postSql = "INSERT INTO likes (idComics, iduser) VALUES (?,?)";
//     connection.query(postSql, [idComics, iduser], (err, result) => {
//         if (err) throw err;
//         res.end();
//     });
// });

router.patch("/addLike/:idComics/:iduser", (req, res) => {
    const idComics = req.params.idComics;
    const iduser = req.params.iduser;

    const addLikeSql = `INSERT INTO likes (idComics, iduser) VALUES (?, ?)`;
    connection.query(addLikeSql, [idComics, iduser], (err, result) => {
        if (err) {
            console.error("Erreur lors de l'ajout des likes :", err);
            res.status(500).send("Erreur interne du serveur");
            return;
        }
        console.log("Like ajouté avec succès");

        const updateLikesSql = `UPDATE comics SET likes = likes + 1 WHERE idComics = ?`;
        connection.query(updateLikesSql, [idComics], (updateErr, updateResult) => {
            if (updateErr) {
                console.error("Erreur lors de la mise à jour des likes dans comics :", updateErr);
                res.status(500).send("Erreur interne du serveur");
                return;
            }
            console.log("Likes dans comics mis à jour avec succès");
            res.end();
        });
    });
});

// ------------------------------------------
router.patch("/removeLike/:idComics/:iduser", (req, res) => {
    const idComics = req.params.idComics;
    const iduser = req.params.iduser;

    const removeLikeSql = `DELETE FROM likes WHERE idComics=? AND iduser=?`;
    connection.query(removeLikeSql, [idComics, iduser], (err, result) => {
        if (err) {
            console.error("Erreur lors de la suppression du like :", err);
            res.status(500).send("Erreur interne du serveur");
            return;
        }
        console.log("Like supprimé avec succès");

        const deleteLikesSql = `UPDATE comics SET likes = likes - 1 WHERE idComics = ?`;
        connection.query(deleteLikesSql, [idComics], (updateErr, updateResult) => {
            if (updateErr) {
                console.error("Erreur lors de la mise à jour des likes dans comics :", updateErr);
                res.status(500).send("Erreur interne du serveur");
                return;
            }
            console.log("Likes dans comics mis à jour avec succès");
            res.end();
        });
    });
});

// router.patch("/removeLike/:idComics/:iduser", (req, res) => {
//     const idComics = req.params.idComics;
//     const iduser = req.params.iduser;
//     const removeSql = "UPDATE comics SET likes = likes - 1 WHERE idComics=?";
//     connection.query(removeSql, [idComics, iduser], (err, result) => {
//         if (err) throw err;
//         res.end();
//     });
//     const deleteSql = "DELETE FROM likes WHERE idComics=? AND iduser=?";
//     connection.query(deleteSql, [idComics, iduser], (err, result) => {
//         if (err) throw err;
//         res.end();
//     });
// });


// ---------------------------------
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