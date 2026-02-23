import "express-session";

declare module "express-session" {
  interface SessionData {
    csrf?: string;
    csrfSecret?: string;
    tokens?: {
      accessToken: string;
      refreshToken: string;
      expiresAt: number;
    };
  }
}

declare global {
  namespace Express {
    interface Request {
      csrfToken(): string;
    }
  }
}
