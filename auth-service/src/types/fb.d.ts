declare module 'fb' {
  export class Facebook {
    constructor(options: {
      appId: string;
      appSecret: string;
    });

    api(
      path: string,
      params: {
        fields?: string[];
        access_token: string;
      },
      callback: (response: any) => void
    ): void;
  }
} 