const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5050";

export type Booking = {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  cityAddress: string;
  serviceType: string;
  flooringType: string;
  areaSize?: number | string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  roomPhoto?: string;
  status: string;
  createdAt: string;
};

const buildUrl = (path: string) => `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(buildUrl(path), {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || "Request failed");
  }

  return (await response.json()) as T;
};

export const getAdminBookings = async () => {
  return request<unknown>("/api/bookings/admin", { method: "GET" });
};

export const updateAdminBookingStatus = async (id: string, status: string) => {
  return request<unknown>(`/api/bookings/admin/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

export const deleteAdminBooking = async (id: string) => {
  return request<unknown>(`/api/bookings/admin/${id}`, {
    method: "DELETE",
  });
};
