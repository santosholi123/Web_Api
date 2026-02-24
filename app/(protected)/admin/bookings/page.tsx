"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Booking,
  deleteAdminBooking,
  updateAdminBookingStatus,
} from "@/lib/api/bookings";
import styles from "../users/users.module.css";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5050";

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
];

const formatDate = (value?: string) => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString();
};

const resolveBookingsList = (payload: unknown): Booking[] => {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as { data?: unknown })?.data)
      ? (payload as { data?: unknown }).data
      : Array.isArray((payload as { bookings?: unknown })?.bookings)
        ? (payload as { bookings?: unknown }).bookings
        : [];

  return (list as Booking[]).map((item) => {
    const data = item as Booking & { _id?: string; phone?: string; address?: string };
    return {
      id: data.id || data._id || "",
      fullName: data.fullName || "—",
      phoneNumber: data.phoneNumber || data.phone || "—",
      email: data.email,
      cityAddress: data.cityAddress || data.address || "—",
      serviceType: data.serviceType || "—",
      flooringType: data.flooringType || "—",
      areaSize: data.areaSize,
      preferredDate: data.preferredDate || "—",
      preferredTime: data.preferredTime || "—",
      notes: data.notes,
      roomPhoto: data.roomPhoto,
      status: data.status || "Pending",
      createdAt: data.createdAt || "—",
    };
  });
};

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [viewError, setViewError] = useState("");
  const [viewLoading, setViewLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      try {
        setError("");
        const url = `${API_BASE}/api/bookings/admin`;
        console.log("Admin bookings URL:", url);
        const response = await fetch(url, { credentials: "include" });
        if (!response.ok) {
          throw new Error("Failed to load bookings");
        }
        const payload = await response.json();
        const list = resolveBookingsList(payload);
        if (isMounted) {
          setBookings(list.filter((booking) => booking.id));
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load bookings");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateAdminBookingStatus(id, status);
      setBookings((prev) =>
        prev.map((booking) => (booking.id === id ? { ...booking, status } : booking))
      );
      if (selectedBooking?.id === id) {
        setSelectedBooking({ ...selectedBooking, status });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this booking?");
    if (!confirmed) return;

    try {
      await deleteAdminBooking(id);
      setBookings((prev) => prev.filter((booking) => booking.id !== id));
      if (selectedBooking?.id === id) {
        setSelectedBooking(null);
        setViewOpen(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete booking");
    }
  };

  const openView = async (booking: Booking) => {
    setViewOpen(true);
    setViewError("");
    setViewLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/bookings/admin/${booking.id}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to load booking details");
      }

      const payload = await response.json();
      const data = payload?.data ?? payload?.booking ?? payload ?? booking;
      setSelectedBooking({
        ...booking,
        fullName: data.fullName ?? booking.fullName,
        phoneNumber: data.phoneNumber ?? data.phone ?? booking.phoneNumber,
        email: data.email ?? booking.email,
        cityAddress: data.cityAddress ?? data.address ?? booking.cityAddress,
        serviceType: data.serviceType ?? booking.serviceType,
        flooringType: data.flooringType ?? booking.flooringType,
        areaSize: data.areaSize ?? booking.areaSize,
        preferredDate: data.preferredDate ?? booking.preferredDate,
        preferredTime: data.preferredTime ?? booking.preferredTime,
        notes: data.notes ?? booking.notes,
        roomPhoto: data.roomPhoto ?? booking.roomPhoto,
        status: data.status ?? booking.status,
        createdAt: data.createdAt ?? booking.createdAt,
      });
    } catch (err) {
      setViewError(err instanceof Error ? err.message : "Failed to load booking details");
      setSelectedBooking(booking);
    } finally {
      setViewLoading(false);
    }
  };

  const closeView = () => {
    setViewOpen(false);
    setSelectedBooking(null);
    setViewError("");
  };

  const statusChoices = useMemo(() => statusOptions, []);

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <button type="button" className={styles.backButton} onClick={() => router.push("/admin")}>
          ← Back to Admin Dashboard
        </button>
      </div>

      <header className={styles.header}>
        <h1 className={styles.title}>Bookings</h1>
        {error && <p className={styles.muted}>{error}</p>}
      </header>

      <section className={styles.card}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Phone</th>
                <th>Service</th>
                <th>Flooring</th>
                <th>Preferred Date</th>
                <th>Preferred Time</th>
                <th>Status</th>
                <th>Created</th>
                <th className={styles.actionCol}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={`skeleton-${index}`}>
                    <td className={styles.muted}>Loading...</td>
                    <td className={styles.muted}>Loading...</td>
                    <td className={styles.muted}>Loading...</td>
                    <td className={styles.muted}>Loading...</td>
                    <td className={styles.muted}>Loading...</td>
                    <td className={styles.muted}>Loading...</td>
                    <td className={styles.muted}>Loading...</td>
                    <td className={styles.muted}>Loading...</td>
                    <td className={styles.muted}>Loading...</td>
                  </tr>
                ))}

              {!isLoading && bookings.length === 0 && (
                <tr>
                  <td className={styles.muted} colSpan={9}>
                    No bookings yet
                  </td>
                </tr>
              )}

              {!isLoading &&
                bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.fullName}</td>
                    <td className={styles.muted}>{booking.phoneNumber}</td>
                    <td>{booking.serviceType}</td>
                    <td>{booking.flooringType}</td>
                    <td className={styles.muted}>{booking.preferredDate}</td>
                    <td className={styles.muted}>{booking.preferredTime}</td>
                    <td>
                      <select
                        className={styles.input}
                        value={booking.status.toLowerCase()}
                        onChange={(event) => handleStatusChange(booking.id, event.target.value)}
                      >
                        {statusChoices.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className={styles.muted}>{formatDate(booking.createdAt)}</td>
                    <td className={styles.actionCol}>
                      <div className={styles.actionButtons}>
                        <button
                          type="button"
                          className={styles.deleteButton}
                          onClick={() => openView(booking)}
                        >
                          View
                        </button>
                        <button
                          type="button"
                          className={styles.deleteButton}
                          onClick={() => handleDelete(booking.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {viewOpen && (
        <div className={styles.overlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h2>Booking Details</h2>
              <button type="button" className={styles.closeButton} onClick={closeView}>
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              {viewLoading && <p className={styles.muted}>Loading booking details...</p>}
              {viewError && <p className={styles.muted}>{viewError}</p>}
              {selectedBooking && !viewLoading && (
                <div className={styles.fieldGrid}>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Full Name</span>
                    <span className={styles.fieldValue}>{selectedBooking.fullName}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Email</span>
                    <span className={styles.fieldValue}>{selectedBooking.email ?? "—"}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Phone</span>
                    <span className={styles.fieldValue}>{selectedBooking.phoneNumber}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Address</span>
                    <span className={styles.fieldValue}>{selectedBooking.cityAddress}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Service</span>
                    <span className={styles.fieldValue}>{selectedBooking.serviceType}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Flooring</span>
                    <span className={styles.fieldValue}>{selectedBooking.flooringType}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Area Size</span>
                    <span className={styles.fieldValue}>{selectedBooking.areaSize ?? "—"}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Preferred Date</span>
                    <span className={styles.fieldValue}>{selectedBooking.preferredDate}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Preferred Time</span>
                    <span className={styles.fieldValue}>{selectedBooking.preferredTime}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Notes</span>
                    <span className={styles.fieldValue}>{selectedBooking.notes ?? "—"}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Status</span>
                    <span className={styles.fieldValue}>{selectedBooking.status}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Created</span>
                    <span className={styles.fieldValue}>{formatDate(selectedBooking.createdAt)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
