import { useState, useEffect, useCallback } from "react";
import { env } from "../config/env";
import { createErrorMessage } from "../utils/errorHandling";
import { fetchWithTimeout } from "../utils/fetchWithTimeout";
import type { SchedulerExistingEvent } from "@cubedoodl/react-simple-scheduler";
import {
  AuthStatusSchema,
  CsrfTokenSchema,
  AthleteSchema,
  ActivitiesSchema,
  type Athlete,
  type Activity,
} from "../types/strava";

const API_TIMEOUT = 30_000;

const apiFetch = (url: string, options: RequestInit = {}) =>
  fetchWithTimeout(url, { credentials: "include", ...options }, API_TIMEOUT);

export const useStrava = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [events, setEventsState] = useState<SchedulerExistingEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  const fetchCsrfToken = useCallback(async () => {
    try {
      const response = await apiFetch(`${env.BFF_URL}/auth/csrf-token`);

      if (!response.ok) throw new Error("Failed to fetch CSRF token");

      const data = CsrfTokenSchema.parse(await response.json());
      setCsrfToken(data.csrfToken);
    } catch (err) {
      console.error("Failed to fetch CSRF token:", err);
      setError(createErrorMessage("csrf", err));
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const response = await apiFetch(`${env.BFF_URL}/auth/status`);

      if (!response.ok) {
        setIsAuthenticated(false);
        return;
      }

      const data = AuthStatusSchema.parse(await response.json());
      setIsAuthenticated(data.authenticated);

      if (data.authenticated) {
        await fetchCsrfToken();
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setIsAuthenticated(false);
      setError(createErrorMessage("auth", err));
    } finally {
      setIsLoading(false);
    }
  }, [fetchCsrfToken]);

  const ensureCalendarUser = useCallback(
    async (userId: number) => {
      const getResponse = await apiFetch(
        `${env.BFF_URL}/event/events/${userId}`,
      );

      if (getResponse.ok) {
        const data = await getResponse.json();
        if (data?.task?.events) setEventsState(data.task.events);
        return;
      }

      if (getResponse.status !== 404) {
        throw new Error("Failed to check calendar user");
      }

      if (!csrfToken) throw new Error("Missing CSRF token");

      const createResponse = await apiFetch(`${env.BFF_URL}/event/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ UserID: userId }),
      });

      if (!createResponse.ok) throw new Error("Failed to create calendar user");
    },
    [csrfToken],
  );

  const fetchAthlete = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await apiFetch(`${env.BFF_URL}/api/athlete`);

      if (!response.ok) throw new Error("Failed to fetch athlete data");

      const data = AthleteSchema.parse(await response.json());
      setAthlete(data);
      setError(null);
      await ensureCalendarUser(data.id);
    } catch (err) {
      console.error("Failed to fetch athlete:", err);
      setError(createErrorMessage("athlete", err));
    }
  }, [isAuthenticated, ensureCalendarUser]);

  const fetchActivities = useCallback(
    async (page: number = 1, perPage: number = 30) => {
      if (!isAuthenticated) return;

      const validPage = Math.max(1, Math.floor(Number(page) || 1));
      const validPerPage = Math.min(
        200,
        Math.max(1, Math.floor(Number(perPage) || 30)),
      );

      try {
        const response = await apiFetch(
          `${env.BFF_URL}/api/activities?page=${validPage}&per_page=${validPerPage}`,
        );

        if (!response.ok) throw new Error("Failed to fetch activities");

        const data = ActivitiesSchema.parse(await response.json());
        setActivities(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch activities:", err);
        setError(createErrorMessage("activities", err));
      }
    },
    [isAuthenticated],
  );

  const setEvents = useCallback(
    async (updated: SchedulerExistingEvent[]) => {
      setEventsState(updated);
      if (!isAuthenticated || !athlete?.id) return;
      if (!csrfToken) throw new Error("Missing CSRF token");

      try {
        const response = await apiFetch(
          `${env.BFF_URL}/event/events/${athlete.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-Token": csrfToken,
            },
            body: JSON.stringify({ events: updated }),
          },
        );

        if (!response.ok) throw new Error("Failed to update events");
      } catch (err) {
        console.error("Failed to update events:", err);
        setError(createErrorMessage("events", err));
      }
    },
    [isAuthenticated, athlete?.id, csrfToken],
  );

  const login = useCallback(() => {
    window.location.href = `${env.BFF_URL}/auth/strava`;
  }, []);

  const logout = useCallback(async () => {
    try {
      if (!csrfToken) throw new Error("Missing CSRF token");

      const response = await apiFetch(`${env.BFF_URL}/auth/logout`, {
        method: "POST",
        headers: { "X-CSRF-Token": csrfToken },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Logout failed");
      }

      setIsAuthenticated(false);
      setAthlete(null);
      setActivities([]);
      setEventsState([]);
      setCsrfToken(null);
      setError(null);
    } catch (err) {
      console.error("Logout failed:", err);
      setError(createErrorMessage("logout", err));
    }
  }, [csrfToken]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle OAuth redirect — clean URL params; checkAuth already handles token fetching
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authSuccess = params.get("auth");
    const authError = params.get("error");

    if (authSuccess === "success" || authError) {
      if (authError) {
        setError(createErrorMessage("auth", authError));
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return {
    isAuthenticated,
    isLoading,
    athlete,
    activities,
    events,
    error,
    login,
    logout,
    fetchAthlete,
    fetchActivities,
    setEvents,
  };
};
