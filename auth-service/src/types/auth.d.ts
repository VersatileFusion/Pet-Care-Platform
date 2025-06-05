interface SocialUserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

declare module '../controllers/auth.controller' {
  export class AuthController {
    private verifyGoogleToken(token: string): Promise<SocialUserData>;
    private verifyFacebookToken(token: string): Promise<SocialUserData>;
  }
} 