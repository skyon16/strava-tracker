import { Request, Response, NextFunction } from "express";
import { stravaService, StravaTokens } from "../services/strava.service.js";

declare module "express-session" {
  interface SessionData {
    tokens?: StravaTokens;
    csrf?: string;
  }
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.session.tokens) {
    res.status(401).json({ error: "Unauthorized. Please login with Strava." });
    return;
  }

  next();
};

export const ensureValidToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const tokens = req.session.tokens;

  if (!tokens) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    if (stravaService.isTokenExpired(tokens.expiresAt)) {
      const refreshedData = await stravaService.refreshAccessToken(
        tokens.refreshToken,
      );

      req.session.tokens = {
        accessToken: refreshedData.access_token,
        refreshToken: refreshedData.refresh_token,
        expiresAt: refreshedData.expires_at,
      };

      await new Promise<void>((resolve, reject) => {
        req.session.save((err?: Error) => {
          if (err) reject(err);
          else resolve(undefined);
        });
      });
    }

    next();
  } catch (error) {
    console.error("Token refresh failed:", error);
    req.session.destroy(() => {
      res.status(401).json({
        error: "Token refresh failed. Please login again.",
      });
    });
  }
};
