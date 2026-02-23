import { useState, useEffect, useCallback } from "react";
import { env } from "../config/env";
import { createErrorMessage } from "../utils/errorHandling";
import { fetchWithTimeout } from "../utils/fetchWithTimeout";
import {
  AuthStatusSchema,
  CsrfTokenSchema,
  AthleteSchema,
  ActivitiesSchema,
  type Athlete,
  type Activity,
} from "../types/strava";

export const useStrava = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  const fetchCsrfToken = useCallback(async () => {
    try {
      const response = await fetchWithTimeout(
        `${env.BFF_URL}/auth/csrf-token`,
        { credentials: "include" },
        30000,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch CSRF token");
      }

      const rawData = await response.json();
      const data = CsrfTokenSchema.parse(rawData);
      setCsrfToken(data.csrfToken);
    } catch (err) {
      console.error("Failed to fetch CSRF token:", err);
      setError(createErrorMessage("csrf", err));
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetchWithTimeout(
        `${env.BFF_URL}/auth/status`,
        { credentials: "include" },
        30000,
      );

      if (!response.ok) {
        setIsAuthenticated(false);
        return;
      }

      const rawData = await response.json();
      const data = AuthStatusSchema.parse(rawData);
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

  const fetchAthlete = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await fetchWithTimeout(
        `${env.BFF_URL}/api/athlete`,
        { credentials: "include" },
        30000,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch athlete data");
      }

      const rawData = await response.json();
      const data = AthleteSchema.parse(rawData);
      setAthlete(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch athlete:", err);
      setError(createErrorMessage("athlete", err));
    }
  }, [isAuthenticated]);

  const fetchActivities = useCallback(
    async (page: number = 1, perPage: number = 30) => {
      if (!isAuthenticated) return;

      const validPage = Math.max(1, Math.floor(Number(page) || 1));
      const validPerPage = Math.min(
        200,
        Math.max(1, Math.floor(Number(perPage) || 30)),
      );

      try {
        const response = await fetchWithTimeout(
          `${env.BFF_URL}/api/activities?page=${validPage}&per_page=${validPerPage}`,
          { credentials: "include" },
          30000,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch activities");
        }

        const rawData = await response.json();
        const data = ActivitiesSchema.parse(rawData);
        setActivities(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch activities:", err);
        setError(createErrorMessage("activities", err));
      }
    },
    [isAuthenticated],
  );

  const login = () => {
    window.location.href = `${env.BFF_URL}/auth/strava`;
  };

  const logout = async () => {
    try {
      if (!csrfToken) {
        throw new Error("Missing CSRF token");
      }

      const response = await fetchWithTimeout(
        `${env.BFF_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "X-CSRF-Token": csrfToken,
          },
        },
        30000,
      );

      if (response.ok) {
        setIsAuthenticated(false);
        setAthlete(null);
        setActivities([]);
        setCsrfToken(null);
        setError(null);
      } else {
        const data = await response.json();
        throw new Error(data.error || "Logout failed");
      }
    } catch (err) {
      console.error("Logout failed:", err);
      setError(createErrorMessage("logout", err));
    }
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authSuccess = params.get("auth");
    const authError = params.get("error");

    if (authSuccess === "success") {
      setIsAuthenticated(true);
      fetchCsrfToken();
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (authError) {
      setError(createErrorMessage("auth", authError));
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [fetchCsrfToken]);

  return {
    isAuthenticated,
    isLoading,
    athlete,
    activities,
    error,
    login,
    logout,
    fetchAthlete,
    fetchActivities,
  };
};
