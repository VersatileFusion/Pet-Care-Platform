import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import {
  User,
  AuthProvider,
  UserProfile,
  PetProfile,
} from "../entities/user.entity";
import { AppError } from "../middleware/error.middleware";
import { logger } from "../utils/logger";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { Facebook } from "fb";
import { verifyAppleToken } from "../utils/apple-auth";
import { sendEmail } from "../utils/email";
import crypto from "crypto";

export class AuthController {
  private userRepository = AppDataSource.getRepository(User);
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  private fb = new Facebook({
    appId: process.env.FACEBOOK_APP_ID as string,
    appSecret: process.env.FACEBOOK_APP_SECRET as string,
  });

  register = async (req: Request, res: Response) => {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        provider,
        providerId,
        profile,
      } = req.body;

      const existingUser = await this.userRepository.findOneBy({ email });
      if (existingUser) {
        throw new AppError(400, "Email already registered");
      }

      const user = this.userRepository.create({
        email,
        password,
        firstName,
        lastName,
        provider: provider || AuthProvider.LOCAL,
        providerId,
        verificationToken: crypto.randomBytes(32).toString("hex"),
        profile: {
          ...profile,
          pets: [],
          loyaltyPoints: 0,
          achievements: [],
        } as UserProfile,
      });

      await this.userRepository.save(user);

      // Send verification email
      await sendEmail({
        to: email,
        subject: "Verify your email",
        text: `Please verify your email by clicking this link: ${process.env.FRONTEND_URL}/verify-email/${user.verificationToken}`,
      });

      const token = this.generateToken(user);
      res.status(201).json({ token, user: this.sanitizeUser(user) });
    } catch (error) {
      logger.error("Registration error:", error);
      throw new AppError(500, "Registration failed");
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new AppError(401, "Invalid credentials");
      }

      if (!user.isActive) {
        throw new AppError(403, "Account is deactivated");
      }

      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        user.loginAttempts += 1;
        user.lastLoginAttempt = new Date();
        await this.userRepository.save(user);
        throw new AppError(401, "Invalid credentials");
      }

      // Reset login attempts on successful login
      user.loginAttempts = 0;
      user.lastLogin = new Date();
      await this.userRepository.save(user);

      const token = this.generateToken(user);
      res.json({ token, user: this.sanitizeUser(user) });
    } catch (error) {
      logger.error("Login error:", error);
      throw new AppError(500, "Login failed");
    }
  };

  updateProfile = async (req: Request, res: Response) => {
    try {
      const userId = (req.user as User).id;
      const { profile } = req.body;

      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new AppError(404, "User not found");
      }

      user.profile = {
        ...user.profile,
        ...profile,
      };

      await this.userRepository.save(user);
      res.json({ user: this.sanitizeUser(user) });
    } catch (error) {
      logger.error("Profile update error:", error);
      throw new AppError(500, "Failed to update profile");
    }
  };

  addPet = async (req: Request, res: Response) => {
    try {
      const userId = (req.user as User).id;
      const petData: PetProfile = req.body;

      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new AppError(404, "User not found");
      }

      if (!user.profile) {
        user.profile = { pets: [], loyaltyPoints: 0 } as UserProfile;
      }

      user.profile.pets.push({
        ...petData,
        id: crypto.randomUUID(),
      });

      await this.userRepository.save(user);
      res.json({ user: this.sanitizeUser(user) });
    } catch (error) {
      logger.error("Add pet error:", error);
      throw new AppError(500, "Failed to add pet");
    }
  };

  updatePet = async (req: Request, res: Response) => {
    try {
      const userId = (req.user as User).id;
      const { petId } = req.params;
      const petData: Partial<PetProfile> = req.body;

      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user || !user.profile) {
        throw new AppError(404, "User or pet not found");
      }

      const petIndex = user.profile.pets.findIndex((p: PetProfile) => p.id === petId);
      if (petIndex === -1) {
        throw new AppError(404, "Pet not found");
      }

      user.profile.pets[petIndex] = {
        ...user.profile.pets[petIndex],
        ...petData,
      };

      await this.userRepository.save(user);
      res.json({ user: this.sanitizeUser(user) });
    } catch (error) {
      logger.error("Update pet error:", error);
      throw new AppError(500, "Failed to update pet");
    }
  };

  deletePet = async (req: Request, res: Response) => {
    try {
      const userId = (req.user as User).id;
      const { petId } = req.params;

      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user || !user.profile) {
        throw new AppError(404, "User or pet not found");
      }

      user.profile.pets = user.profile.pets.filter((p: PetProfile) => p.id !== petId);
      await this.userRepository.save(user);
      res.json({ user: this.sanitizeUser(user) });
    } catch (error) {
      logger.error("Delete pet error:", error);
      throw new AppError(500, "Failed to delete pet");
    }
  };

  socialLogin = async (req: Request, res: Response) => {
    try {
      const { token, provider } = req.body;
      let userData: { id: string; email: string; firstName: string; lastName: string };

      switch (provider) {
        case AuthProvider.GOOGLE:
          userData = await this.verifyGoogleToken(token);
          break;
        case AuthProvider.FACEBOOK:
          userData = await this.verifyFacebookToken(token);
          break;
        case AuthProvider.APPLE:
          userData = await verifyAppleToken(token);
          break;
        default:
          throw new AppError(400, "Invalid provider");
      }

      let user = await this.userRepository.findOneBy({ email: userData.email });
      if (!user) {
        user = this.userRepository.create({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          provider,
          providerId: userData.id,
          isEmailVerified: true,
        });
        await this.userRepository.save(user);
      }

      const authToken = this.generateToken(user);
      res.json({ token: authToken, user: this.sanitizeUser(user) });
    } catch (error) {
      logger.error("Social login error:", error);
      throw new AppError(500, "Social login failed");
    }
  };

  forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new AppError(404, "User not found");
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
      await this.userRepository.save(user);

      await sendEmail({
        to: email,
        subject: "Reset your password",
        text: `Please reset your password by clicking this link: ${process.env.FRONTEND_URL}/reset-password/${resetToken}`,
      });

      res.json({ message: "Password reset email sent" });
    } catch (error) {
      logger.error("Forgot password error:", error);
      throw new AppError(500, "Failed to process forgot password request");
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { token, password } = req.body;
      const user = await this.userRepository.findOneBy({
        resetPasswordToken: token,
      });

      if (!user || user.resetPasswordExpires < new Date()) {
        throw new AppError(400, "Invalid or expired reset token");
      }

      user.password = password;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await this.userRepository.save(user);

      res.json({ message: "Password reset successful" });
    } catch (error) {
      logger.error("Reset password error:", error);
      throw new AppError(500, "Failed to reset password");
    }
  };

  verifyEmail = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const user = await this.userRepository.findOneBy({
        verificationToken: token,
      });

      if (!user) {
        throw new AppError(400, "Invalid verification token");
      }

      user.isEmailVerified = true;
      user.verificationToken = null;
      await this.userRepository.save(user);

      res.json({ message: "Email verified successfully" });
    } catch (error) {
      logger.error("Email verification error:", error);
      throw new AppError(500, "Failed to verify email");
    }
  };

  private generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );
  }

  private sanitizeUser(user: User): Partial<User> {
    const {
      password,
      resetPasswordToken,
      resetPasswordExpires,
      verificationToken,
      ...sanitizedUser
    } = user;
    return sanitizedUser;
  }

  private async verifyGoogleToken(token: string): Promise<{ id: string; email: string; firstName: string; lastName: string }> {
    const ticket = await this.googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email || !payload?.sub || !payload?.given_name || !payload?.family_name) {
      throw new AppError(401, "Invalid Google token");
    }
    return {
      id: payload.sub,
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
    };
  }

  private async verifyFacebookToken(token: string): Promise<{ id: string; email: string; firstName: string; lastName: string }> {
    return new Promise((resolve, reject) => {
      this.fb.api(
        "me",
        {
          fields: ["id", "email", "first_name", "last_name"],
          access_token: token,
        },
        (res: any) => {
          if (res.error || !res.id || !res.email || !res.first_name || !res.last_name) {
            reject(new AppError(401, "Invalid Facebook token"));
          }
          resolve({
            id: res.id,
            email: res.email,
            firstName: res.first_name,
            lastName: res.last_name,
          });
        }
      );
    });
  }
}
