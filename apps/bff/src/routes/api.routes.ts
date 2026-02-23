import { Router, Request, Response } from "express";
import { stravaService } from "../services/strava.service.js";
import {
  requireAuth,
  ensureValidToken,
} from "../middleware/auth.middleware.js";

export const apiRouter = Router();

apiRouter.use(requireAuth);
apiRouter.use(ensureValidToken);

apiRouter.get("/athlete", async (req: Request, res: Response) => {
  try {
    const accessToken = req.session.tokens!.accessToken;
    const athlete = await stravaService.getAthlete(accessToken);

    res.json(athlete);
  } catch (error) {
    console.error("Error fetching athlete:", error);
    res.status(500).json({ error: "Failed to fetch athlete profile" });
  }
});

apiRouter.get("/activities", async (req: Request, res: Response) => {
  try {
    const accessToken = req.session.tokens!.accessToken;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const perPage = Math.min(
      200,
      Math.max(1, parseInt(req.query.per_page as string) || 30),
    );

    const activities = await stravaService.getActivities(
      accessToken,
      page,
      perPage,
    );

    res.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

apiRouter.get("/activities/:id", async (req: Request, res: Response) => {
  try {
    const accessToken = req.session.tokens!.accessToken;
    let idParam = req.params.id;
    if (Array.isArray(idParam)) {
      idParam = idParam[0];
    }
    const activityId = parseInt(idParam || "0");

    if (isNaN(activityId) || activityId <= 0) {
      return res.status(400).json({ error: "Invalid activity ID" });
    }

    const activity = await stravaService.getActivity(accessToken, activityId);

    res.json(activity);
  } catch (error) {
    console.error("Error fetching activity:", error);
    res.status(500).json({ error: "Failed to fetch activity" });
  }
});
