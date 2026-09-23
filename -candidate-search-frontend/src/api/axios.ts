import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "../utils/auth";
import type { ApiResponse } from "../types/candidate";
import type { RefreshResponse } from "../types/auth";

export interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let baseUrl = (import.meta.env.VITE_API_BASE_URL || "https://localhost:7065/api").trim();
if (baseUrl.includes("||")) {
  baseUrl = baseUrl.split("||")[0].trim();
}

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach accessToken to protected requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Do not attach expired access token to login or refresh endpoints
    const isAuthEndpoint =
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/refresh") ||
      config.url?.includes("/auth/register");

    if (!isAuthEndpoint) {
      const accessToken = getAccessToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error: unknown) => Promise.reject(error)
);

// Shared promise for handling concurrent 401 refresh requests
let refreshPromise: Promise<string> | null = null;

// Intercept 401 responses, refresh token, and retry request once
api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetryableAxiosRequestConfig | undefined;

    // If no request config exists, reject
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Never attempt token refresh if the failed endpoint itself is login or refresh
    const isRefreshOrLogin =
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/login");

    if (isRefreshOrLogin) {
      clearTokens();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    // Prevent infinite loop: only retry original request once
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const currentRefreshToken = getRefreshToken();
    if (!currentRefreshToken) {
      clearTokens();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    // Queue / lock concurrent 401 requests to a single refresh call
    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const refreshUrl = `${baseUrl.replace(/\/+$/, "")}/auth/refresh`;
          const response = await axios.post<ApiResponse<RefreshResponse>>(
            refreshUrl,
            { refreshToken: currentRefreshToken },
            { headers: { "Content-Type": "application/json" } }
          );

          if (response.data?.success && response.data.data?.accessToken) {
            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            setTokens(accessToken, newRefreshToken || currentRefreshToken);
            return accessToken;
          }

          throw new Error(response.data?.message || "Token refresh failed");
        } catch (refreshError: unknown) {
          clearTokens();
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          throw refreshError;
        } finally {
          refreshPromise = null;
        }
      })();
    }

    try {
      const newAccessToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError: unknown) {
      return Promise.reject(refreshError);
    }
  }
);

export default api;