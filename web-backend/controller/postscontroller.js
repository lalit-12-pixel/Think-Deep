const posts = require("../models/post");
const User = require("../models/User");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const BASE_URL = process.env.BASE_URL || "http://localhost:3001";

exports.createPost = async (req, res, next) => {
  try {
    if (!req.session?.user?._id) {
      return res.status(401).json({ error: "Unauthorized: No user session" });
    }

    let description = "";
    let imageUrl = "";

    if (req.is("multipart/form-data") || req.file) {
      description = req.body.description || "";

      if (req.file) {
        imageUrl = `${BASE_URL}/uploads/${req.file.filename}`;
      } else {
        imageUrl = "";
      }
    } else {
      // handle JSON body fallback
      description = req.body.description || "";
    }

    const post = new posts({
      description,
      imageUrl,
      user: req.session.user._id,
    });
    await post.save();
    const populatedPost = await post.populate("user", "name username avatar");
    res.status(201).json({ message: "Post created successfully", post: populatedPost });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await posts.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const imageUrl = post.imageUrl;
    const imageName = imageUrl ? path.basename(imageUrl) : null;

    await posts.findByIdAndDelete(id);

    if (imageName) {
      const imagePath = path.join(__dirname, "..", "uploads", imageName);
      fs.unlink(imagePath, (err) => {
        if (err) console.warn("Error deleting image:", err.message);
        else console.log("Image file deleted:", imagePath);
      });
    }

    return res.status(200).json({ message: "Post deleted", id });
  } catch (err) {
    console.error("Error deleting post:", err);
    return res.status(500).json({ error: "Failed to delete post" });
  }
};

exports.updateStat = async (req, res) => {
  const { field, action, comment } = req.body;
  const { id } = req.params;

  try {
    const post = await posts.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const validFields = ["likes", "dislikes", "comments", "shares"];
    if (!validFields.includes(field)) {
      return res.status(400).json({ message: "Invalid field name" });
    }

    if (field === "comments") {
      if (!comment?.text) return res.status(400).json({ message: "Comment text is required" });
      if (!req.session?.isLoggedIn || !req.session?.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      post.comments.push({
        user: req.session.user._id,
        text: comment.text,
        name: req.session.user.name || "Anonymous",
        avatar: req.session.user.avatar || "",
        createdAt: new Date(),
      });
    } else {
      const delta = action === "decrement" ? -1 : 1;
      post[field] = Math.max((post[field] || 0) + delta, 0);
    }

    await post.save();
    const updatedPost = await posts.findById(id).populate("user", "name username avatar");

    return res.status(200).json({ message: "Stat updated", post: updatedPost });
  } catch (error) {
    console.error("Update stat error:", error);
    return res.status(500).json({ message: "Error updating stat" });
  }
};

exports.getmyposts = async (req, res) => {
  const limit = parseInt(req.query._limit) || 10;
  const page = parseInt(req.query._page) || 1;
  const skip = (page - 1) * limit;

  if (!req.session?.isLoggedIn || !req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = req.session.user._id;

  try {
    const userPosts = await posts
      .find({ user: userId })
      .populate("user", "name username avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ posts: userPosts });
  } catch (err) {
    console.error("Error fetching user posts:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.editmyprofile = async (req, res) => {
  try {
    if (!req.session?.isLoggedIn || !req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.session.user._id;
    const { name, bio, location, DOB, username } = req.body;

    let avatar;
    if (req.file) {
      avatar = `${BASE_URL}/uploads/${req.file.filename}`;

      const oldAvatarUrl = req.session.user.avatar;
      if (oldAvatarUrl && oldAvatarUrl.startsWith(`${BASE_URL}/uploads/`) && !oldAvatarUrl.includes("webicon3.png")) {
        const oldPath = path.join(__dirname, "../", "uploads", path.basename(oldAvatarUrl));
        fs.unlink(oldPath, (err) => {
          if (err) console.warn("Failed to delete old avatar:", err.message);
          else console.log("Old avatar deleted:", oldPath);
        });
      }
    }

    const updateFields = { name, bio, location, DOB, username };
    if (avatar) updateFields.avatar = avatar;

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });
    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    req.session.user = updatedUser;
    req.session.save((err) => {
      if (err) {
        console.warn("Session save error:", err);
        return res.status(500).json({ error: "Session save failed" });
      }
      res.status(200).json({ success: true, user: updatedUser });
    });
  } catch (err) {
    console.error("MongoDB update failed:", err);
    res.status(500).json({ error: "Update failed" });
  }
};

exports.deleteuser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    await posts.deleteMany({ user: id });

    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "User deleted but failed to destroy session" });
      res.clearCookie("connect.sid", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" });
      res.status(200).json({ message: "User deleted and session cleared" });
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getbestpost = async (req, res) => {
  try {
    const bestPost = await posts.findOne().sort({ likes: -1 }).populate("user", "name username avatar").lean();
    if (!bestPost) return res.status(404).json({ error: "No thought found" });

    res.json({
      id: bestPost._id,
      content: bestPost.description,
      image: bestPost.imageUrl || "",
      likes: bestPost.likes || 0,
      comments: bestPost.comments || [],
      createdAt: bestPost.createdAt,
      user: bestPost.user,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.setSave = async (req, res) => {
  const { postId } = req.params;
  try {
    if (!req.session?.isLoggedIn || !req.session.user) return res.status(401).json({ error: "Unauthorized" });

    const userId = req.session.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const alreadySaved = user.saved.some((savedId) => savedId.toString() === postId);
    if (!alreadySaved) {
      user.saved.push(new mongoose.Types.ObjectId(postId));
      await user.save();
      return res.json({ message: "Post saved", saved: user.saved });
    } else {
      return res.status(400).json({ error: "Post already saved" });
    }
  } catch (err) {
    console.error("Error in setSave:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.setUnsave = async (req, res) => {
  const { postId } = req.params;
  try {
    if (!req.session?.isLoggedIn || !req.session.user) return res.status(401).json({ error: "Unauthorized" });

    const userId = req.session.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.saved = user.saved.filter((id) => id.toString() !== postId);
    await user.save();
    res.json({ message: "Post removed from saved", saved: user.saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// NEW: public posts listing (used by frontend)
exports.getAllPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query._limit) || 5;
    const page = parseInt(req.query._page) || 1;
    const skip = (page - 1) * limit;

    const allPosts = await posts
      .find({})
      .populate("user", "name username avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json(allPosts);
  } catch (error) {
    console.error("Error loading posts:", error);
    res.status(500).json({ error: "Failed to load posts" });
  }
};
