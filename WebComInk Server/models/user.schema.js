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
        order: { type: Number, default: 0 },
        status: { type: String, default: "En cours" },
      },
    ],
    customCategories: { type: [String], default: [] },
    readingHistory: [
      {
        mangaId: { type: String, required: true },
        mangaTitle: { type: String, required: true },
        mangaSlug: { type: String, required: true },
        coverImage: { type: String },
        chapterId: { type: String, required: true },
        chapterNumber: { type: String, required: true },
        chapterTitle: { type: String },
        readAt: { type: Date, default: Date.now },
        progress: { type: Number, default: 100 },
      },
    ],
    pendingEmail: { type: String, default: null },
    pendingEmailToken: { type: String, default: null },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
