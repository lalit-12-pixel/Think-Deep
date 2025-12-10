const express = require("express");
const authRouter = express.Router();
const authController = require("../controller/authcontroller");
const passport = require("passport");

// FRONTEND URL (set via env)
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Start Google OAuth
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
authRouter.get(
  "/google/callback",
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
        res.redirect(`${FRONTEND_URL}/home`);
      });
    });
  }
);

// Logout
authRouter.post("/signout", authController.postsignout); // keep POST signout
authRouter.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });
      res.redirect(FRONTEND_URL);
    });
  });
});

// Local auth routes
authRouter.post("/login", authController.postlogin);
authRouter.post("/signup", authController.postsignup);

// Expose a minimal posts endpoint for controllers that expect it
authRouter.get("/me", (req, res) => {
  if (!req.user) return res.json({ loggedIn: false });
  return res.json({ loggedIn: true, user: req.user });
});

module.exports = authRouter;
