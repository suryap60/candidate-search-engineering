export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken");
};

export const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  // Clean up legacy key if present
  localStorage.removeItem("token");
};

export const isAuthenticated = (): boolean => {
  return Boolean(getAccessToken());
};
