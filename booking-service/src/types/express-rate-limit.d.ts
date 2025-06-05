import { Request, Response, NextFunction } from 'express';

declare module 'express-rate-limit' {
  export interface RateLimitRequestHandler extends RequestHandler {
    resetKey(key: string): void;
  }

  export interface Options {
    windowMs?: number;
    max?: number | ((req: Request) => number | Promise<number>);
    message?: any;
    statusCode?: number;
    headers?: boolean;
    skipFailedRequests?: boolean;
    skipSuccessfulRequests?: boolean;
    keyGenerator?: (req: Request) => string | Promise<string>;
    handler?: (req: Request, res: Response) => void;
    onLimitReached?: (req: Request, res: Response) => void;
    store?: any;
  }

  export default function rateLimit(options?: Options): RateLimitRequestHandler;
} 