
const express = require('express');
const path = require('path');
const User =require('./models/User');

//for google login
const passport = require("passport");
require("dotenv").config();
require("./config/passport");
//


const { default: mongoose } = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors');

const postRouter = require('./router/postsrouter');
const errorsController = require('./controller/error');
const authrouter = require('./router/authrouter');


const DB_PATH = "mongodb+srv://routralalit:lalit.in@lalit.w02qtxh.mongodb.net/posts?retryWrites=true&w=majority&appName=lalit";

const app = express();


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/uploads", express.static("uploads"));

const store = new MongoDBStore({
  uri: DB_PATH,
  collection: "sessions"
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    httpOnly: true,
    secure: false, 
    sameSite: 'lax'
  }
}));

//for google login
app.use(passport.initialize());
app.use(passport.session());


app.use(authrouter); 

app.get("/", async (req, res) => {
  if (!req.session?.isLoggedIn || !req.session?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const freshUser = await User.findById(req.session.user._id).lean();

    if (!freshUser) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ user: freshUser });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});
  





app.use(postRouter); 


app.use(errorsController.pageNotFound);

const PORT = 3001;

mongoose.connect(DB_PATH)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
