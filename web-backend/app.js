require("dotenv").config(); 

const express = require('express');
const path = require('path');
const User = require('./models/User');

// Passport
const passport = require("passport");
require("./config/passport");

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors');

const postRouter = require('./router/postsrouter');
const errorsController = require('./controller/error');
const authrouter = require('./router/authrouter');

// 🔥 Use MONGO_URI from environment (important for Render!)
const DB_PATH = process.env.MONGO_URI;

const app = express();

// 🌍 CORS (Production + Local)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://think-deep-hazel.vercel.app"
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// 🗄 Session Store
const store = new MongoDBStore({
  uri: DB_PATH,
  collection: "sessions"
});

// 🛑 PRODUCTION COOKIE SETTINGS FOR RENDER
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true on Render
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routers
app.use("/auth", authrouter);
app.use(postRouter);

// ✔ Session check route
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

// 🟢 IMPORTANT: Render dynamic PORT
const PORT = process.env.PORT || 3001;

mongoose.connect(DB_PATH)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
