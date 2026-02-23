import axios, { AxiosInstance } from "axios";
import { env } from "../config/env.js";

export interface StravaTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface StravaAthlete {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  city: string;
  state: string;
  country: string;
  profile: string;
}

export interface StravaTokenResponse {
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
  athlete: StravaAthlete;
}

class StravaService {
  private readonly baseURL = "https://www.strava.com/api/v3";
  private readonly authURL = "https://www.strava.com/oauth";

  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: env.STRAVA_CLIENT_ID,
      redirect_uri: env.STRAVA_REDIRECT_URI,
      response_type: "code",
      approval_prompt: "auto",
      scope: "read,activity:read_all,activity:write",
      state,
    });

    return `${this.authURL}/authorize?${params.toString()}`;
  }

  async exchangeToken(code: string): Promise<StravaTokenResponse> {
    try {
      const response = await axios.post<StravaTokenResponse>(
        `${this.authURL}/token`,
        {
          client_id: env.STRAVA_CLIENT_ID,
          client_secret: env.STRAVA_CLIENT_SECRET,
          code,
          grant_type: "authorization_code",
        },
        {
          timeout: 10000,
        },
      );

      return response.data;
    } catch (error) {
      console.error("Error exchanging Strava token:", error);
      throw new Error("Failed to exchange authorization code");
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<StravaTokenResponse> {
    try {
      const response = await axios.post<StravaTokenResponse>(
        `${this.authURL}/token`,
        {
          client_id: env.STRAVA_CLIENT_ID,
          client_secret: env.STRAVA_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        },
        {
          timeout: 10000,
        },
      );

      return response.data;
    } catch (error) {
      console.error("Error refreshing Strava token:", error);
      throw new Error("Failed to refresh access token");
    }
  }

  getAuthenticatedClient(accessToken: string): AxiosInstance {
    return axios.create({
      baseURL: this.baseURL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });
  }

  async getActivities(
    accessToken: string,
    page = 1,
    perPage = 30,
  ): Promise<any[]> {
    const client = this.getAuthenticatedClient(accessToken);

    try {
      const response = await client.get("/athlete/activities", {
        params: { page, per_page: perPage },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching activities:", error);
      throw new Error("Failed to fetch activities");
    }
  }

  async getAthlete(accessToken: string): Promise<StravaAthlete> {
    const client = this.getAuthenticatedClient(accessToken);

    try {
      const response = await client.get("/athlete");
      return response.data;
    } catch (error) {
      console.error("Error fetching athlete:", error);
      throw new Error("Failed to fetch athlete profile");
    }
  }

  async getActivity(accessToken: string, activityId: number): Promise<any> {
    const client = this.getAuthenticatedClient(accessToken);

    try {
      const response = await client.get(`/activities/${activityId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching activity:", error);
      throw new Error("Failed to fetch activity");
    }
  }

  isTokenExpired(expiresAt: number): boolean {
    return Date.now() / 1000 >= expiresAt;
  }
}

export const stravaService = new StravaService();
