const Comment = require("../models/comment.schema");
const User = require("../models/user.schema");

// Récupérer tous les commentaires d'un chapitre
const getCommentsByChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Récupérer les commentaires avec pagination
    const comments = await Comment.find({
      chapterId,
      parentCommentId: null, // Seulement les commentaires principaux (pas les réponses)
    })
      .populate("userId", "username avatar")
      .sort({ createdAt: -1 }) // Plus récents en premier
      .skip(skip)
      .limit(limit);

    // Compter le total pour la pagination
    const totalComments = await Comment.countDocuments({
      chapterId,
      parentCommentId: null,
    });

    const totalPages = Math.ceil(totalComments / limit);

    res.json({
      success: true,
      data: {
        comments,
        pagination: {
          currentPage: page,
          totalPages,
          totalComments,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Erreur getCommentsByChapter:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des commentaires",
    });
  }
};

// Créer un nouveau commentaire
const createComment = async (req, res) => {
  try {
    const { chapterId, mangaId, content } = req.body;
    const userId = req.user.id; // Récupéré du middleware d'authentification

    // Validation
    if (!chapterId || !mangaId || !content) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis",
      });
    }

    if (content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Le commentaire ne peut pas être vide",
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Le commentaire ne peut pas dépasser 1000 caractères",
      });
    }

    // Récupérer les infos de l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Créer le commentaire
    const newComment = new Comment({
      chapterId,
      mangaId,
      userId,
      username: user.username,
      userAvatar: user.avatar,
      content: content.trim(),
    });

    const savedComment = await newComment.save();

    // Populer les données utilisateur pour la réponse
    await savedComment.populate("userId", "username avatar");

    res.status(201).json({
      success: true,
      data: savedComment,
      message: "Commentaire créé avec succès",
    });
  } catch (error) {
    console.error("Erreur createComment:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du commentaire",
    });
  }
};

// Modifier un commentaire
const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // Validation
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Le commentaire ne peut pas être vide",
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Le commentaire ne peut pas dépasser 1000 caractères",
      });
    }

    // Trouver le commentaire
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Commentaire non trouvé",
      });
    }

    // Vérifier que l'utilisateur est le propriétaire du commentaire
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas autorisé à modifier ce commentaire",
      });
    }

    // Mettre à jour le commentaire
    comment.content = content.trim();
    comment.isEdited = true;
    comment.editedAt = new Date();

    const updatedComment = await comment.save();
    await updatedComment.populate("userId", "username avatar");

    res.json({
      success: true,
      data: updatedComment,
      message: "Commentaire modifié avec succès",
    });
  } catch (error) {
    console.error("Erreur updateComment:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la modification du commentaire",
    });
  }
};

// Supprimer un commentaire
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    // Trouver le commentaire
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Commentaire non trouvé",
      });
    }

    // Vérifier que l'utilisateur est le propriétaire du commentaire
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas autorisé à supprimer ce commentaire",
      });
    }

    // Supprimer le commentaire
    await Comment.findByIdAndDelete(commentId);

    res.json({
      success: true,
      message: "Commentaire supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur deleteComment:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du commentaire",
    });
  }
};

// Liker/Unliker un commentaire
const toggleLikeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    // Trouver le commentaire
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Commentaire non trouvé",
      });
    }

    // Vérifier si l'utilisateur a déjà liké
    const hasLiked = comment.likes.includes(userId);

    if (hasLiked) {
      // Retirer le like
      comment.likes = comment.likes.filter((id) => id.toString() !== userId);
      comment.likesCount = Math.max(0, comment.likesCount - 1);
    } else {
      // Ajouter le like
      comment.likes.push(userId);
      comment.likesCount += 1;
    }

    const updatedComment = await comment.save();

    res.json({
      success: true,
      data: {
        commentId,
        liked: !hasLiked,
        likesCount: updatedComment.likesCount,
      },
      message: hasLiked ? "Like retiré" : "Commentaire liké",
    });
  } catch (error) {
    console.error("Erreur toggleLikeComment:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors du like/unlike",
    });
  }
};

module.exports = {
  getCommentsByChapter,
  createComment,
  updateComment,
  deleteComment,
  toggleLikeComment,
};
