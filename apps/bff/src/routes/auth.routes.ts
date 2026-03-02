import { Router, Request, Response } from "express";
import crypto from "crypto";
import { stravaService } from "../services/strava.service.js";
import { env } from "../config/env.js";

export const authRouter = Router();

authRouter.get("/strava", (req: Request, res: Response) => {
  const csrfToken = crypto.randomBytes(32).toString("hex");
  req.session.csrf = csrfToken;
  const authUrl = stravaService.getAuthorizationUrl(csrfToken);

  req.session.save((err) => {
    if (err) {
      console.error("Session save error:", err);
      return res.redirect(`${env.FRONTEND_URL}?error=session_error`);
    }
    res.redirect(authUrl);
  });
});

authRouter.get("/strava/callback", async (req: Request, res: Response) => {
  const { code, state, error } = req.query;

  if (error) {
    return res.redirect(`${env.FRONTEND_URL}?error=access_denied`);
  }

  if (!state || state !== req.session.csrf) {
    return res.redirect(`${env.FRONTEND_URL}?error=invalid_state`);
  }

  if (!code || typeof code !== "string") {
    return res.redirect(`${env.FRONTEND_URL}?error=invalid_code`);
  }

  try {
    const tokenData = await stravaService.exchangeToken(code);

    req.session.tokens = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: tokenData.expires_at,
    };

    delete req.session.csrf;

    await new Promise<void>((resolve, reject) => {
      req.session.save((err?: Error) => {
        if (err) reject(err);
        else resolve(undefined);
      });
    });

    res.redirect(`${env.FRONTEND_URL}?auth=success`);
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.redirect(`${env.FRONTEND_URL}?error=auth_failed`);
  }
});

authRouter.get("/csrf-token", (req: Request, res: Response) => {
  if (!req.session.tokens) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = req.csrfToken();
  res.json({ csrfToken: token });
});

authRouter.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((err?: Error) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.clearCookie(env.SESSION_NAME);
    res.json({ message: "Logged out successfully" });
  });
});

authRouter.get("/status", (req: Request, res: Response) => {
  res.json({ authenticated: !!req.session.tokens });
});
