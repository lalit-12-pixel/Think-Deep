const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs").promises;

const UserSchema = new mongoose.Schema(
  {
    googleId: String,
    name: String,
    email: { type: String, unique: true },
    username: { type: String, required: true, unique: true },
    avatar: String,
    isVerified: { type: Boolean, default: false },
    password: String,
    location: String,
    DOB: Date,
    bio: String,
    saved: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
      },
    ],
  },
  {
    timestamps: true,
  }
);

//  to delete avatar file on user deletion
UserSchema.pre("findOneAndDelete", async function (next) {
  try {
    const user = await this.model.findOne(this.getFilter());

    if (
      user?.avatar &&
      user.avatar.startsWith("http://localhost:3001/uploads/") &&
      !user.avatar.includes("webicon3.png")
    ) {
      const avatarPath = path.join(
        __dirname,
        "../uploads",
        path.basename(user.avatar)
      );

      try {
        await fs.unlink(avatarPath);
        console.log("Deleted user avatar:", avatarPath);
      } catch (err) {
        console.warn("Failed to delete user avatar:", err.message);
      }
    }

    next();
  } catch (err) {
    console.error("Error in pre-delete hook:", err.message);
    next(err);
  }
});

module.exports = mongoose.model("users", UserSchema);
