const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: null },
    token: String,
  },
  {
    timestamps: true,
  }
);
tempUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 120 });

const TempUser = mongoose.model("TempUser", tempUserSchema);

module.exports = TempUser;
