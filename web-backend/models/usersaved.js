const mongoose = require("mongoose");

const UsersavedSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserPost", UsersavedSchema);
