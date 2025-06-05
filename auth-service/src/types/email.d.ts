declare module '../utils/email' {
  export function sendEmail(options: {
    to: string;
    subject: string;
    text: string;
    html?: string;
  }): Promise<void>;
  
  export function sendVerificationEmail(email: string, token: string): Promise<void>;
  export function sendPasswordResetEmail(email: string, token: string): Promise<void>;
  export function sendWelcomeEmail(email: string, name: string): Promise<void>;
} 