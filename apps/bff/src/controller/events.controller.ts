import { Request, Response } from "express";
// import { event } from "../types/types";
import { supabase } from "../config/supabase";

export class EventsController {
  async createCalendarUser(req: Request, res: Response): Promise<void> {
    const { UserID } = req.body;
    const { data, error } = await supabase
      .from("UserCalendars")
      .insert({ UserID });

    if (error) res.status(400).json({ error: error.message });
    else res.status(201).json({ task: data });
  }

  async getEvents(req: Request, res: Response): Promise<void> {
    const { UserID } = req.params;
    const { data, error } = await supabase
      .from("UserCalendars")
      .select("*")
      .eq("UserID", UserID)
      .single();
    if (error) res.status(404).json({ error: error.message });
    else res.status(200).json({ task: data }); // probably single out events from data
  }
  async updateEvents(req: Request, res: Response): Promise<void> {
    const { UserID } = req.params;
    const { events } = req.body;
    const { data, error } = await supabase
      .from("UserCalendars")
      .update({ events })
      .eq("UserID", UserID)
      .single();
    if (error) res.status(400).json({ error: error.message });
    else res.status(200).json({ task: data });
  }
}
