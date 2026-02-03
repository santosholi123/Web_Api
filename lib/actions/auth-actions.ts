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
