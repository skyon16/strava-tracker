import { Router } from "express";
import { EventsController } from "../controller/events.controller";

export const eventsRouter = Router();
const eventsController = new EventsController();

eventsRouter.post(
  "/events",
  eventsController.createCalendarUser.bind(eventsController),
);
eventsRouter.get(
  "/events/:UserID",
  eventsController.getEvents.bind(eventsController),
);
eventsRouter.put(
  "/events/:UserID",
  eventsController.updateEvents.bind(eventsController),
);
