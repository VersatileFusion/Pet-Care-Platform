declare module '../utils/apple-auth' {
  export function verifyAppleToken(token: string): Promise<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  }>;
} 