import { env } from "../config/env";

export const sanitizeErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (env.IS_PRODUCTION) {
    return fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return fallback;
};

export const createErrorMessage = (context: string, error: unknown): string => {
  const fallbackMessages: Record<string, string> = {
    auth: "Authentication failed. Please try again.",
    athlete: "Failed to load your profile. Please refresh the page.",
    activities: "Failed to load activities. Please try again later.",
    logout: "Logout failed. Please try again.",
    csrf: "Security token error. Please refresh the page.",
  };

  const fallback =
    fallbackMessages[context] || "An error occurred. Please try again.";
  return sanitizeErrorMessage(error, fallback);
};
