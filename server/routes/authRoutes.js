import express from "express";
import passport from "passport";
import {
  register,
  login,
  getMe,
  googleCallback,
  completeOAuthRegistration,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

// OAuth completion route
router.post("/oauth-complete", completeOAuthRegistration);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  googleCallback
);

export default router;

