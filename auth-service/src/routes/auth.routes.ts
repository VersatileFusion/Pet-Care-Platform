import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as AppleStrategy } from "passport-apple";
import { logger } from "../utils/logger";
import { AuthController } from "../controllers/auth.controller";
import { validateDto } from "../middleware/validate.middleware";
import {
  RegisterDto,
  LoginDto,
  SocialLoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from "../dto/auth.dto";
import { validateSession, roleGuard } from "../middleware/security.middleware";
import { loginLimiter, apiLimiter } from "../middleware/security.middleware";

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterDto'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or email already registered
 */
router.post("/register", apiLimiter, authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginLimiter, authController.login);

/**
 * @swagger
 * /api/auth/social-login:
 *   post:
 *     summary: Login with social provider (Google, Facebook, Apple)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SocialLoginDto'
 *     responses:
 *       200:
 *         description: Social login successful
 *       401:
 *         description: Invalid social token
 */
router.post("/social-login", apiLimiter, authController.socialLogin);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordDto'
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 */
router.post("/forgot-password", apiLimiter, authController.forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password with token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordDto'
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
router.post("/reset-password", apiLimiter, authController.resetPassword);

/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     summary: Verify email with token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyEmailDto'
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid verification token
 */
router.post("/verify-email", apiLimiter, authController.verifyEmail);

// Google OAuth configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // TODO: Implement user creation/update logic
        logger.info("Google authentication successful", { profile });
        return done(null, profile);
      } catch (error) {
        logger.error("Google authentication error:", error);
        return done(error as Error);
      }
    }
  )
);

// Facebook OAuth configuration
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID || "",
      clientSecret: process.env.FACEBOOK_APP_SECRET || "",
      callbackURL: "/api/auth/facebook/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // TODO: Implement user creation/update logic
        logger.info("Facebook authentication successful", { profile });
        return done(null, profile);
      } catch (error) {
        logger.error("Facebook authentication error:", error);
        return done(error as Error);
      }
    }
  )
);

// Apple OAuth configuration
passport.use(
  new AppleStrategy(
    {
      clientID: process.env.APPLE_CLIENT_ID || "",
      teamID: process.env.APPLE_TEAM_ID || "",
      keyID: process.env.APPLE_KEY_ID || "",
      privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH || "",
      callbackURL: "/api/auth/apple/callback",
    },
    async (req, accessToken, refreshToken, idToken, profile, done) => {
      try {
        // TODO: Implement user creation/update logic
        logger.info("Apple authentication successful", { profile });
        return done(null, profile);
      } catch (error) {
        logger.error("Apple authentication error:", error);
        return done(error as Error);
      }
    }
  )
);

// Auth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // TODO: Generate JWT token and send response
    res.json({ message: "Google authentication successful" });
  }
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  (req, res) => {
    // TODO: Generate JWT token and send response
    res.json({ message: "Facebook authentication successful" });
  }
);

router.get(
  "/apple",
  passport.authenticate("apple", { scope: ["name", "email"] })
);

router.get(
  "/apple/callback",
  passport.authenticate("apple", { session: false }),
  (req, res) => {
    // TODO: Generate JWT token and send response
    res.json({ message: "Apple authentication successful" });
  }
);

// Protected routes
router.use(validateSession);

// User profile routes
router.put("/profile", authController.updateProfile);
router.post("/pets", authController.addPet);
router.put("/pets/:petId", authController.updatePet);
router.delete("/pets/:petId", authController.deletePet);

// Admin routes
router.get("/users", roleGuard(["admin"]), async (req, res) => {
  // TODO: Implement user listing for admin
});

router.put("/users/:userId/role", roleGuard(["admin"]), async (req, res) => {
  // TODO: Implement role update for admin
});

router.put("/users/:userId/status", roleGuard(["admin"]), async (req, res) => {
  // TODO: Implement user status update for admin
});

export default router;
