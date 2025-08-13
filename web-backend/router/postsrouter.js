// External Modules
const express = require("express");
const multer = require("multer");
const path = require("path");


const postsRouter = express.Router();

// Local Module
const postsController = require("../controller/postscontroller");


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });



postsRouter.post("/createpost", upload.single("image"), postsController.createPost);
postsRouter.delete("/posts/:id", postsController.deletePost);
postsRouter.patch("/posts/:id/stat", postsController.updateStat);
postsRouter.get("/myposts",  postsController.getmyposts);
postsRouter.put("/editprofile", upload.single("avatar"),  postsController.editmyprofile);
postsRouter.delete("/deleteuser/:id", postsController.deleteuser);

postsRouter.get("/bestpost",  postsController.getbestpost);
postsRouter.patch("/posts/save/:postId",postsController.setSave);
postsRouter.delete("/posts/save/:postId",postsController.setUnsave);





module.exports = postsRouter;
