import jwt from 'jsonwebtoken';
import { AppError } from '../middleware/error.middleware';

interface AppleTokenPayload {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  sub: string;
  email?: string;
}

export const verifyAppleToken = async (token: string): Promise<{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}> => {
  try {
    const decoded = jwt.decode(token) as AppleTokenPayload;
    if (!decoded) {
      throw new AppError(401, 'Invalid Apple token');
    }

    // Verify the token's issuer and audience
    if (
      decoded.iss !== 'https://appleid.apple.com' ||
      decoded.aud !== process.env.APPLE_CLIENT_ID
    ) {
      throw new AppError(401, 'Invalid Apple token');
    }

    // Check if the token is expired
    if (decoded.exp < Date.now() / 1000) {
      throw new AppError(401, 'Apple token expired');
    }

    // Extract user information
    const [firstName, lastName] = (decoded.sub || '').split('.');

    return {
      id: decoded.sub,
      email: decoded.email || `${decoded.sub}@privaterelay.appleid.com`,
      firstName: firstName || 'Apple',
      lastName: lastName || 'User',
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(401, 'Failed to verify Apple token');
  }
}; 