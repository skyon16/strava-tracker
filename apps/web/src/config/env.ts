const requiredEnvVars = {
  BFF_URL: import.meta.env.VITE_BFF_URL,
} as const;

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: VITE_${key}`);
  }
});

const validateUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    if (import.meta.env.PROD && parsed.protocol !== "https:") {
      console.warn("Warning: BFF URL should use HTTPS in production");
    }
    return url;
    // no logging setup,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error(`Invalid BFF_URL format: ${url}`);
  }
};

export const env = {
  BFF_URL: validateUrl(requiredEnvVars.BFF_URL),
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
} as const;
