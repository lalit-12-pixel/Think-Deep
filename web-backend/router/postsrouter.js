// External Modules
const express = require("express");
const multer = require("multer");
const path = require("path");

const postsRouter = express.Router();
const postsController = require("../controller/postscontroller");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Create post
postsRouter.post("/createpost", upload.single("image"), postsController.createPost);

// Delete post
postsRouter.delete("/posts/:id", postsController.deletePost);

// Update stats
postsRouter.patch("/posts/:id/stat", postsController.updateStat);

// My posts
postsRouter.get("/myposts", postsController.getmyposts);

// Edit profile (avatar)
postsRouter.put("/editprofile", upload.single("avatar"), postsController.editmyprofile);

// Delete user
postsRouter.delete("/deleteuser/:id", postsController.deleteuser);

// Best post
postsRouter.get("/bestpost", postsController.getbestpost);

// Save/unsave
postsRouter.patch("/posts/save/:postId", postsController.setSave);
postsRouter.delete("/posts/save/:postId", postsController.setUnsave);

// <-- NEW: public posts listing (pagination compatible with frontend)
postsRouter.get("/posts", postsController.getAllPosts);

module.exports = postsRouter;
