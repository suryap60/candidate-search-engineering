import api from "./axios";
import type {
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
} from "../types/auth";
import type { ApiResponse } from "../types/candidate";

export const login = async (
  data: LoginRequest
): Promise<ApiResponse<LoginResponse>> => {
  const response = await api.post<ApiResponse<LoginResponse>>(
    "/auth/login",
    data
  );
  return response.data;
};

export const refreshAccessToken = async (
  refreshToken: string
): Promise<ApiResponse<RefreshResponse>> => {
  const payload: RefreshRequest = { refreshToken };
  const response = await api.post<ApiResponse<RefreshResponse>>(
    "/auth/refresh",
    payload
  );
  return response.data;
};