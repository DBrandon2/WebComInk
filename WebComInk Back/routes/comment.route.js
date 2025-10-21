const express = require("express");
const {
  getCommentsByChapter,
  createComment,
  updateComment,
  deleteComment,
  toggleLikeComment
} = require("../controllers/comment.controller");

const router = express.Router();

// Middleware d'authentification
const authenticateToken = require("../middleware/auth");

// Routes publiques (lecture des commentaires)
router.get("/chapter/:chapterId", getCommentsByChapter);

// Routes protégées (nécessitent une authentification)
router.post("/", authenticateToken, createComment);
router.put("/:commentId", authenticateToken, updateComment);
router.delete("/:commentId", authenticateToken, deleteComment);
router.post("/:commentId/like", authenticateToken, toggleLikeComment);

module.exports = router;