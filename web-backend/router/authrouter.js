const express = require("express");
const authRouter = express.Router();
const authController = require("../controller/authcontroller");
const passport = require("passport");

// 🌍 FRONTEND URL (Production + Development)
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// ---------------------------------------------------------
// 🔐 GOOGLE LOGIN – START AUTH FLOW
// ---------------------------------------------------------
authRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ---------------------------------------------------------
// 🔐 GOOGLE LOGIN CALLBACK (Render → Vercel redirect)
// ---------------------------------------------------------
authRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_URL}/login`,
    session: true,
  }),
  (req, res) => {
    req.session.regenerate((err) => {
      if (err) return res.redirect(`${FRONTEND_URL}/login`);

      req.session.user = req.user;
      req.session.isLoggedIn = true;

      req.session.save((err) => {
        if (err) return res.redirect(`${FRONTEND_URL}/login`);

        // SUCCESS → redirect user to frontend dashboard
        res.redirect(`${FRONTEND_URL}/home`);
      });
    });
  }
);

// ---------------------------------------------------------
// 🔐 LOGOUT
// ---------------------------------------------------------
authRouter.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy(() => {
      res.clearCookie("connect.sid", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      // Redirect to frontend homepage
      res.redirect(FRONTEND_URL);
    });
  });
});

// ---------------------------------------------------------
// AUTH ROUTES
// ---------------------------------------------------------
authRouter.post("/login", authController.postlogin);
authRouter.post("/signup", authController.postsignup);
authRouter.post("/signout", authController.postsignout);
authRouter.get("/posts", authController.getPost);

module.exports = authRouter;
