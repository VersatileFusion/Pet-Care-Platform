import rateLimit from "express-rate-limit";
import { AppError } from "./error.middleware";

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
  handler: () => {
    throw new AppError(429, "Too many requests from this IP, please try again later");
  },
} as any);

// Stricter limiter for authentication routes
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many login attempts, please try again later",
  handler: () => {
    throw new AppError(429, "Too many login attempts, please try again later");
  },
} as any);

// Stricter limiter for booking creation
export const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per windowMs
  message: "Too many booking attempts, please try again later",
  handler: () => {
    throw new AppError(429, "Too many booking attempts, please try again later");
  },
} as any);
