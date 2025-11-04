import express from "express";
import passport from "../config/passport.js";

const router = express.Router();

// ===== GOOGLE =====
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login/failed",
  }),
  (req, res) => {
    res.redirect("http://localhost:5173");
  }
);

// ===== FACEBOOK =====
router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login/failed" }),
  (req, res) => {
    res.redirect("http://localhost:5173");
  }
);

// ===== GITHUB =====
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login/failed" }),
  (req, res) => {
    res.redirect("http://localhost:5173");
  }
);

// ===== Common Routes =====
router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } else {
    res.status(403).json({ success: false });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({ success: false, message: "Login Failed" });
});

router.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);

    req.session.destroy(err => {
      if (err) return next(err);

      res.clearCookie("connect.sid", { path: "/" }); 
      res.json({ success: true, message: "Logged out successfully" });
    });
  });
});

export default router;
