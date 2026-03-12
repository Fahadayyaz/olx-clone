const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    ad: { type: mongoose.Schema.Types.ObjectId, ref: "Ad", required: true },
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    lastMessage: {
      text: String,
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Chat", chatSchema);
