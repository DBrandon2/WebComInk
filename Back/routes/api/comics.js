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

router.get("/getBooksComics/:iduser", (req, res) => {
    try {
        const iduser = req.params.iduser;
        console.log("ID utilisateur extrait :", iduser);

        const bookedSql = `SELECT bookmarks.idCOmics, bookmarks.iduser, comics.idComics, comics.title, comics.author, comics.illustrator, comics.banner, comics.portrait, comics.likes, comics.bookmarks, comics.vue FROM bookmarks LEFT JOIN comics ON bookmarks.idComics = comics.idComics WHERE bookmarks.iduser = ? `;
        connection.query(bookedSql, [iduser], (err, result) => {
            if (err) {
                console.error(err);
                throw err;
            }
            console.log("Bookmarks récupérées", result);
            console.log("Nombre de bookmarks récupérés :", result.length);
            res.send(JSON.stringify(result));
        });
    } catch (error) {
        console.error(error);
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

router.get("/getLikes/:idComics/:iduser", (req, res) => {
    const idComics = req.params.idComics;
    const iduser = req.params.iduser;

    console.log("iduser like:",iduser)
    
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

// ---------------------------------
router.get("/getAllLikes/:idComics", (req, res) => {
    const idComics = req.params.idComics;
    const selectAllLikesSql = `SELECT likes FROM comics WHERE idComics=?`;
    connection.query(selectAllLikesSql, [idComics], (err, result) => {
        if (err){
            console.error("Error executing SQL query:", err);
            res.status(500).send("Internal Server Error");
            return;
        }
        console.log("Tous les likes d'un comics", result[0].likes)
        res.send(JSON.stringify(result[0].likes));
    })
})

// -----------------Bookmarks------------------------

router.get("/getBooks/:idComics/:iduser", (req, res) => {
    const idComics = req.params.idComics;
    const iduser = req.params.iduser;
    
    const selectBooksSql = `SELECT COUNT(*) AS bookCount FROM bookmarks WHERE idComics=? AND iduser=?`;
    connection.query(selectBooksSql, [idComics, iduser], (err, result) => {
        if (err) {
            console.error("Erreur lors de l'exécution de la requête SQL :", err);
            res.status(500).send("Erreur interne du serveur");
            return;
        }
        console.log("Bookmarks récupérés", result);
        res.send(JSON.stringify({ bookCount: result[0].bookCount, isBooked: result[0].bookCount > 0 }));
    });
});

// ---------------------------

router.patch("/addBook/:idComics/:iduser", (req, res) => {
    const idComics = req.params.idComics;
    const iduser = req.params.iduser;

    const addBookSql = `INSERT INTO bookmarks (idComics, iduser) VALUES (?, ?)`;
    connection.query(addBookSql, [idComics, iduser], (err, result) => {
        if (err) {
            console.error("Erreur lors de l'ajout des bookmarks :", err);
            res.status(500).send("Erreur interne du serveur");
            return;
        }
        console.log("bookmark ajouté avec succès");

        const updateBookmarksSql = `UPDATE comics SET bookmarks = bookmarks + 1 WHERE idComics = ?`;
        connection.query(updateBookmarksSql, [idComics], (updateErr, updateResult) => {
            if (updateErr) {
                console.error("Erreur lors de la mise à jour des bookmarks dans comics :", updateErr);
                res.status(500).send("Erreur interne du serveur");
                return;
            }
            console.log("Bookmarks dans comics mis à jour avec succès");
            res.end();
        });
    });
});

// -----------------

router.patch("/removeBook/:idComics/:iduser", (req, res) => {
    const idComics = req.params.idComics;
    const iduser = req.params.iduser;

    const removeBookSql = `DELETE FROM bookmarks WHERE idComics=? AND iduser=?`;
    connection.query(removeBookSql, [idComics, iduser], (err, result) => {
        if (err) {
            console.error("Erreur lors de la suppression du book :", err);
            res.status(500).send("Erreur interne du serveur");
            return;
        }
        console.log("Bookmarks supprimé avec succès");

        const deleteBooksSql = `UPDATE comics SET bookmarks = bookmarks - 1 WHERE idComics = ?`;
        connection.query(deleteBooksSql, [idComics], (updateErr, updateResult) => {
            if (updateErr) {
                console.error("Erreur lors de la mise à jour des books dans comics :", updateErr);
                res.status(500).send("Erreur interne du serveur");
                return;
            }
            console.log("Bookmarks dans comics mis à jour avec succès");
            res.end();
        });
    });
});

// -------------------

router.get("/getAllBooks/:idComics", (req, res) => {
    const idComics = req.params.idComics;
    const selectAllBooksSql = `SELECT bookmarks FROM comics WHERE idComics=?`;
    connection.query(selectAllBooksSql, [idComics], (err, result) => {
        if (err){
            console.error("Error executing SQL query:", err);
            res.status(500).send("Internal Server Error");
            return;
        }
        console.log("Tous les bookmarks d'un comics", result[0].bookmarks)
        res.send(JSON.stringify(result[0].bookmarks));
    })
})

router.get("/getAllLikes/:idComics", (req, res) => {
    const idComics = req.params.idComics;
    const selectAllLikesSql = `SELECT likes FROM comics WHERE idComics=?`;
    connection.query(selectAllLikesSql, [idComics], (err, result) => {
        if (err){
            console.error("Error executing SQL query:", err);
            res.status(500).send("Internal Server Error");
            return;
        }
        console.log("Tous les likes d'un comics", result[0].likes)
        res.send(JSON.stringify(result[0].likes));
    })
})
// ----------------------------------

router.patch("/incrementViews/:idComics", (req, res) => {
    const idComics = req.params.idComics;

    const incrementViewsSql = `UPDATE comics SET vue = vue + 1 WHERE idComics = ?`;
    connection.query(incrementViewsSql, [idComics], (err, result) => {
        if (err) {
            console.error("Erreur lors de l'incrémentation des vues :", err);
            res.status(500).send("Erreur interne du serveur");
            return;
        }
        console.log("Vues dans comics incrémentées avec succès");
        res.end();
    });
});


module.exports = router