require("dotenv").config();

const express = require("express");
const path = require("path");
const User = require("./models/User");

// Passport
const passport = require("passport");
require("./config/passport");

const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const cors = require("cors");

const postRouter = require("./router/postsrouter");
const errorsController = require("./controller/error");
const authrouter = require("./router/authrouter");

const DB_PATH = process.env.MONGO_URI;
const app = express();

// FRONTEND & BACKEND ORIGINS
const ALLOWED_ORIGINS = [
  "http://localhost:5173", // local dev
  "https://think-deep-hazel.vercel.app", // your frontend production
  "https://think-deep.onrender.com" // backend origin (for direct requests)
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (mobile apps, curl)
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy: origin not allowed"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads with CORS enabled
app.use("/uploads", cors({ origin: ALLOWED_ORIGINS, credentials: true }), express.static(path.join(__dirname, "uploads")));

// Session store
const store = new MongoDBStore({
  uri: DB_PATH,
  collection: "sessions",
});

// Session + cookie config
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboardcat",
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true on Render
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authrouter); // auth routes
app.use("/", postRouter); // post routes (keeps your existing paths)

// Session check route
app.get("/", async (req, res) => {
  if (!req.session?.isLoggedIn || !req.session?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const freshUser = await User.findById(req.session.user._id).lean();
    if (!freshUser) return res.status(404).json({ error: "User not found" });
    return res.status(200).json({ user: freshUser });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

// Error handler
app.use(errorsController.pageNotFound);

// PORT
const PORT = process.env.PORT || 3001;

mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
