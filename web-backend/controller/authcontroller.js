const posts = require("../models/post");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");


exports.getPost = async (req, res) => {
  const limit = parseInt(req.query._limit) || 10;
  const page = parseInt(req.query._page) || 1;
  const skip = (page - 1) * limit;

  try {
    const allPosts = await posts
      .find()
      .populate("user", "name username avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(allPosts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.postsignup = [

  check("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name should be at least 2 characters long")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name should contain only alphabets"),

  check("username")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Username should be at least 2 characters long")
    .matches(/^[a-zA-Z0-9_\.]+$/)
    .withMessage("Username can contain only letters, numbers, underscores, or dots")
    .custom(async (value) => {
      const existingUser = await User.findOne({ username: value });
      if (existingUser) {
        throw new Error("Username is already taken");
      }
    }),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail()
    .custom(async (value) => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        throw new Error("You have already registered. Please log in.");
      }
    }),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password should contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password should contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password should contain at least one number")
    .matches(/[!@&,.]/)
    .withMessage("Password should contain at least one special character")
    .trim(),

  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),


  async (req, res) => {
    const { name, email, password, username } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        name,
        email,
        password: hashedPassword,
        username,
      });

      await user.save();

      req.session.isLoggedIn = true;
      req.session.user = {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      };

      req.session.save((err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            errors: [{ msg: "Session saving failed" }],
          });
        }

        res.status(201).json({
          success: true,
          message: "User registered and logged in successfully",
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            username: user.username,
          },
        });
      });
    } catch (err) {
      console.error("Signup error:", err);
      res.status(500).json({
        success: false,
        errors: [{ msg: err.message }],
      });
    }
  },
];


exports.postlogin = async (req, res) => {
  const { email, password } = req.body;

  try {
   
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(422).json({
        success: false,
        islogin: false,
        errors: ["User does not exist"],
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(422).json({
        success: false,
        islogin: false,
        errors: ["Invalid password"],
      });
    }

    req.session.isLoggedIn = true;
    req.session.user = {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    };

    req.session.save((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          errors: ["Failed to save session"],
        });
      }

      return res.status(200).json({
        success: true,
        islogin: true,
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          username: user.username,
        },
      });
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({
      success: false,
      islogin: false,
      errors: ["Internal server error"],
    });
  }
};
exports.postsignout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: "Failed to log out",
      });
    }

    res.status(200).json({
      success: true,
      message: "Successfully logged out",
    });
  });
};
