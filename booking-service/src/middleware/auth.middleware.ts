import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "./error.middleware";

interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload;
    }
  }
}

export const verifyToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AppError(401, "No authorization header");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new AppError(401, "No token provided");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;
      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError(401, "Token expired");
      }
      throw new AppError(401, "Invalid token");
    }
  } catch (error) {
    next(error);
  }
};

export const requireAuth = (roles?: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError(401, "Authentication required");
      }

      if (roles && !roles.includes(req.user.role)) {
        throw new AppError(403, "Insufficient permissions");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
