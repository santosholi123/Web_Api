/**
 * API Endpoints
 * Update baseURL in lib/api/axios.ts to change the API server
 */

export const API = {
  HEALTH: "/",
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    VERIFY_RESET_OTP: "/api/auth/verify-reset-otp",
    RESET_PASSWORD: "/api/auth/reset-password",
  },
} as const;

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    VERIFY_RESET_OTP: "/auth/verify-reset-otp",
    RESET_PASSWORD: "/auth/reset-password",
  },
  USER: {
    PROFILE: "/api/auth/me",
    UPDATE: "/api/auth/me",
    AVATAR: "/api/auth/avatar",
  },
  PRODUCTS: {
    LIST: "/products",
    GET: (id: string) => `/products/${id}`,
    CREATE: "/products",
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
  },
} as const;
