const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: null },
    favorites: [
      {
        mangaId: { type: String, required: true },
        title: { type: String, required: true },
        coverImage: { type: String },
        addedAt: { type: Date, default: Date.now },
        order: { type: Number, default: 0 }, // Ajout du champ d'ordre
        status: { type: String, default: "En cours" }, // Catégorie du manga
      },
    ],
    customCategories: { type: [String], default: [] }, // Catégories personnalisées
    pendingEmail: { type: String, default: null },
    pendingEmailToken: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
