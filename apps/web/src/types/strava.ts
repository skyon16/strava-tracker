import { z } from "zod";

export const AuthStatusSchema = z.object({
  authenticated: z.boolean(),
});

export const CsrfTokenSchema = z.object({
  csrfToken: z.string(),
});

export const AthleteSchema = z.object({
  id: z.number(),
  username: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  sex: z.string(),
  profile: z.string(),
  profile_medium: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ActivitySchema = z.object({
  id: z.number(),
  name: z.string(),
  distance: z.number(),
  moving_time: z.number(),
  elapsed_time: z.number(),
  total_elevation_gain: z.number(),
  type: z.string(),
  start_date: z.string(),
  start_date_local: z.string(),
  timezone: z.string(),
  average_speed: z.number(),
  max_speed: z.number(),
  average_heartrate: z.number().optional(),
  max_heartrate: z.number().optional(),
  kudos_count: z.number(),
  achievement_count: z.number(),
});

export const ActivitiesSchema = z.array(ActivitySchema);

export type AuthStatus = z.infer<typeof AuthStatusSchema>;
export type CsrfToken = z.infer<typeof CsrfTokenSchema>;
export type Athlete = z.infer<typeof AthleteSchema>;
export type Activity = z.infer<typeof ActivitySchema>;
