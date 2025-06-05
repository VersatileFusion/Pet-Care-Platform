import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { AppDataSource } from '../data-source';
import { User } from '../entities/user.entity';
import { AppError } from './error.middleware';
import jwt from 'jsonwebtoken';

// Rate limiting configuration
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Security middleware
export const securityMiddleware = [
  helmet(),
  (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  },
];

// Account lockout middleware
export const accountLockoutMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.path === '/login' && req.method === 'POST') {
    const { email } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email });

    if (user) {
      const now = new Date();
      const lockoutTime = 15 * 60 * 1000; // 15 minutes

      if (
        user.loginAttempts >= 5 &&
        user.lastLoginAttempt &&
        now.getTime() - user.lastLoginAttempt.getTime() < lockoutTime
      ) {
        throw new AppError(
          429,
          'Account is locked. Please try again after 15 minutes'
        );
      }

      if (
        user.lastLoginAttempt &&
        now.getTime() - user.lastLoginAttempt.getTime() > lockoutTime
      ) {
        user.loginAttempts = 0;
        await userRepository.save(user);
      }
    }
  }
  next();
};

// Session validation middleware
export const validateSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new AppError(401, 'No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: (decoded as any).id });

    if (!user || !user.isActive) {
      throw new AppError(401, 'Invalid or inactive session');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new AppError(401, 'Invalid token');
  }
};

// Role-based access control middleware
export const roleGuard = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(403, 'Forbidden');
    }

    next();
  };
}; 