import { api } from "../api/axios";

export interface AuthPayload {
  email: string;
  password: string;
}

export async function registerUser(payload: AuthPayload) {
  try {
    const res = await api.post("/api/auth/register", payload);
    return res.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || "Request failed");
  }
}

export async function loginUser(payload: AuthPayload) {
  try {
    const res = await api.post("/api/auth/login", payload);
    return res.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || "Request failed");
  }
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyResetOtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export async function requestPasswordReset(payload: ForgotPasswordPayload) {
  try {
    const res = await api.post("/api/auth/forgot-password", payload);
    return res.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || "Request failed");
  }
}

export async function verifyResetOtp(payload: VerifyResetOtpPayload) {
  try {
    const res = await api.post("/api/auth/verify-reset-otp", payload);
    return res.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || "Request failed");
  }
}

export async function resetPassword(payload: ResetPasswordPayload) {
  try {
    const res = await api.post("/api/auth/reset-password", payload);
    return res.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || "Request failed");
  }
}
