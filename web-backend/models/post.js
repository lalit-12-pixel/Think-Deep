const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs").promises;

const postSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    imageUrl: { type: String },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
          required: true,
        },

        text: String,
        name: String,
        avatar: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    shares: { type: Number, default: 0 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//  to delete post image files when deleting multiple posts
postSchema.pre("deleteMany", async function (next) {
  try {
    const posts = await this.model.find(this.getFilter());

    for (const post of posts) {
      const imageUrl = post.imageUrl;

      if (
        imageUrl &&
        imageUrl.startsWith("http://localhost:3001/uploads/") &&
        !imageUrl.includes("default.png")
      ) {
        const imagePath = path.join(
          __dirname,
          "../uploads",
          path.basename(imageUrl)
        );

        try {
          await fs.unlink(imagePath);
          console.log("Deleted post image:", imagePath);
        } catch (err) {
          console.warn("Failed to delete post image:", err.message);
        }
      }
    }

    next();
  } catch (err) {
    if (err.code === "ENOENT") {
      console.warn("Image not found, already deleted:", imagePath);
    } else {
      console.warn("Failed to delete post image:", err.message);
    }
  }
});

module.exports = mongoose.model("posts", postSchema);
