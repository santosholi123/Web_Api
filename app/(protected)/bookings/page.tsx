"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/axios";
import styles from "./bookings.module.css";

type BookingFormState = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  serviceType: string;
  flooringType: string;
  areaSize: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  roomPhotoName: string;
};

type FieldErrors = Partial<Record<keyof BookingFormState, string>>;

type BookingPayload = {
  fullName: string;
  phone: string;
  email: string;
  cityAddress: string;
  serviceType: string;
  flooringType: string;
  areaSize: number;
  preferredDate: string;
  preferredTime: string;
  notes: string;
};

const initialFormState: BookingFormState = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  serviceType: "Installation",
  flooringType: "Homogeneous",
  areaSize: "",
  preferredDate: "",
  preferredTime: "Morning 8-12",
  notes: "",
  roomPhotoName: "",
};

const phoneRegex = /^(\+977)?\d{10}$/;

const getToken = () => {
  if (typeof document === "undefined") return null;
  const cookieMatch = document.cookie.match(/(?:^|; )token=([^;]*)/);
  if (cookieMatch?.[1]) return decodeURIComponent(cookieMatch[1]);
  return localStorage.getItem("token");
};

const resolveBookingPayload = (
  data: unknown,
  fallback: BookingPayload
): BookingPayload => {
  if (!data || typeof data !== "object") return fallback;

  const container = data as {
    booking?: Partial<BookingPayload>;
    data?: Partial<BookingPayload>;
  };

  const candidate = container.booking ?? container.data ?? (data as Partial<BookingPayload>);

  return {
    fullName: candidate.fullName ?? fallback.fullName,
    phone: candidate.phone ?? fallback.phone,
    email: candidate.email ?? fallback.email,
    cityAddress:
      (candidate as Partial<BookingPayload> & { address?: string }).cityAddress ??
      (candidate as Partial<BookingPayload> & { address?: string }).address ??
      fallback.cityAddress,
    serviceType: candidate.serviceType ?? fallback.serviceType,
    flooringType: candidate.flooringType ?? fallback.flooringType,
    areaSize:
      typeof candidate.areaSize === "number"
        ? candidate.areaSize
        : Number(candidate.areaSize ?? fallback.areaSize) || fallback.areaSize,
    preferredDate: candidate.preferredDate ?? fallback.preferredDate,
    preferredTime: candidate.preferredTime ?? fallback.preferredTime,
    notes: candidate.notes ?? fallback.notes,
  };
};

const faqItems = [
  {
    title: "How soon can I book a visit?",
    content:
      "Most visits are scheduled within 24–48 hours, depending on technician availability in your area.",
  },
  {
    title: "Is there a site inspection before final pricing?",
    content:
      "Yes. We confirm measurements and site conditions before sharing the final quotation.",
  },
  {
    title: "Do you bring flooring samples?",
    content:
      "We can bring curated samples on request. Mention it in your notes for a tailored selection.",
  },
  {
    title: "Can I reschedule the appointment?",
    content:
      "Absolutely. You can reschedule up to 24 hours before the visit by contacting support.",
  },
];

export default function BookingsPage() {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const okButtonRef = useRef<HTMLButtonElement | null>(null);
  const [formState, setFormState] = useState<BookingFormState>(initialFormState);
  const [touched, setTouched] = useState<Partial<Record<keyof BookingFormState, boolean>>>({});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [submittedPreview, setSubmittedPreview] = useState<BookingPayload | null>(null);

  useEffect(() => {
    if (!isModalOpen) return;

    const previousActive = document.activeElement as HTMLElement | null;
    okButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsModalOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousActive?.focus();
    };
  }, [isModalOpen]);

  const handleChange = (field: keyof BookingFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const validate = (state: BookingFormState): FieldErrors => {
    const nextErrors: FieldErrors = {};

    if (!state.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!state.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(state.phone.trim())) {
      nextErrors.phone = "Enter a valid 10-digit number or +977XXXXXXXXXX.";
    }

    if (!state.address.trim()) {
      nextErrors.address = "City/Address is required.";
    }

    if (!state.areaSize.trim()) {
      nextErrors.areaSize = "Area size is required.";
    } else if (Number(state.areaSize) <= 0) {
      nextErrors.areaSize = "Area size must be greater than 0.";
    }

    if (!state.preferredDate.trim()) {
      nextErrors.preferredDate = "Preferred date is required.";
    }

    return nextErrors;
  };

  const handleBlur = (field: keyof BookingFormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const nextErrors = validate(formState);
    setErrors(nextErrors);
  };

  const submitBooking = async (payload: BookingPayload) => {
    const token = getToken();
    if (!token) {
      setErrorMessage("Session expired, please login again");
      setTimeout(() => router.replace("/login"), 300);
      return null;
    }

    const response = await api.post("/api/bookings", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validate(formState);
    setErrors(nextErrors);
    setTouched({
      fullName: true,
      phone: true,
      address: true,
      areaSize: true,
      preferredDate: true,
    });

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    const payload: BookingPayload = {
      fullName: formState.fullName.trim(),
      phone: formState.phone.trim(),
      email: formState.email.trim(),
      cityAddress: formState.address.trim(),
      serviceType: formState.serviceType,
      flooringType: formState.flooringType,
      areaSize: Number(formState.areaSize),
      preferredDate: formState.preferredDate,
      preferredTime: formState.preferredTime,
      notes: formState.notes.trim(),
    };

    try {
      const data = await submitBooking(payload);
      if (!data) {
        setIsSubmitting(false);
        return;
      }

      const resolvedPayload = resolveBookingPayload(data, payload);
      setSubmittedPreview(resolvedPayload);
      setSuccessMessage("Booking created successfully");
      setIsModalOpen(true);
      setFormState(initialFormState);
      setTouched({});
      setErrors({});
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to create booking";

      if (status === 401) {
        setErrorMessage("Session expired, please login again");
        setTimeout(() => router.replace("/login"), 300);
      } else {
        setErrorMessage(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setFormState(initialFormState);
    setTouched({});
    setErrors({});
    setSuccessMessage("");
    setErrorMessage("");
    setSubmittedPreview(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const derivedPayload: BookingPayload = useMemo(
    () => ({
      fullName: formState.fullName.trim(),
      phone: formState.phone.trim(),
      email: formState.email.trim(),
      cityAddress: formState.address.trim(),
      serviceType: formState.serviceType,
      flooringType: formState.flooringType,
      areaSize: Number(formState.areaSize) || 0,
      preferredDate: formState.preferredDate,
      preferredTime: formState.preferredTime,
      notes: formState.notes.trim(),
    }),
    [formState]
  );

  const summarySource = submittedPreview ?? derivedPayload;

  const bookingPreview = useMemo(
    () => ({
      fullName: summarySource.fullName || "—",
      phone: summarySource.phone || "—",
      email: summarySource.email || "—",
      cityAddress: summarySource.cityAddress || "—",
      serviceType: summarySource.serviceType || "—",
      flooringType: summarySource.flooringType || "—",
      areaSize: summarySource.areaSize || "—",
      preferredDate: summarySource.preferredDate || "—",
      preferredTime: summarySource.preferredTime || "—",
      notes: summarySource.notes || "—",
      roomPhoto: formState.roomPhotoName || "—",
    }),
    [formState.roomPhotoName, summarySource]
  );

  const areaValue = Number(summarySource.areaSize) || 0;
  const basePrice = areaValue > 0 ? areaValue * 45 : 0;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>FloorEase Booking</p>
          <h1 className={styles.title}>Book Flooring Service</h1>
          <p className={styles.subtitle}>
            Request an installation or repair appointment in minutes.
          </p>
        </div>
        <div className={styles.badges}>
          <span className={styles.badge}>Secure Booking</span>
          <span className={styles.badgeSecondary}>Response within 24h</span>
          <Link href="/dashboard" className={styles.backButton}>
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className={styles.layout}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Booking Details</h2>
            <p>Share a few details so we can schedule the right specialist.</p>
          </div>

          {errorMessage ? (
            <div className={styles.error} role="alert">
              {errorMessage}
            </div>
          ) : null}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <label htmlFor="fullName">Full Name *</label>
                <input
                  id="fullName"
                  type="text"
                  value={formState.fullName}
                  onChange={(event) => handleChange("fullName", event.target.value)}
                  onBlur={() => handleBlur("fullName")}
                  placeholder="Enter your name"
                />
                {touched.fullName && errors.fullName ? (
                  <span className={styles.error}>{errors.fullName}</span>
                ) : null}
              </div>

              <div className={styles.field}>
                <label htmlFor="phone">Phone Number *</label>
                <input
                  id="phone"
                  type="tel"
                  value={formState.phone}
                  onChange={(event) => handleChange("phone", event.target.value)}
                  onBlur={() => handleBlur("phone")}
                  placeholder="98XXXXXXXX or +97798XXXXXXXX"
                />
                {touched.phone && errors.phone ? (
                  <span className={styles.error}>{errors.phone}</span>
                ) : null}
              </div>

              <div className={styles.field}>
                <label htmlFor="email">Email (optional)</label>
                <input
                  id="email"
                  type="email"
                  value={formState.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="address">City/Address *</label>
                <input
                  id="address"
                  type="text"
                  value={formState.address}
                  onChange={(event) => handleChange("address", event.target.value)}
                  onBlur={() => handleBlur("address")}
                  placeholder="Kathmandu, Lalitpur..."
                />
                {touched.address && errors.address ? (
                  <span className={styles.error}>{errors.address}</span>
                ) : null}
              </div>
            </div>

            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <label htmlFor="serviceType">Service Type</label>
                <select
                  id="serviceType"
                  value={formState.serviceType}
                  onChange={(event) => handleChange("serviceType", event.target.value)}
                >
                  <option value="Installation">Installation</option>
                  <option value="Repair">Repair</option>
                  <option value="Polish">Polish</option>
                  <option value="Inspection">Inspection</option>
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="flooringType">Flooring Type</label>
                <select
                  id="flooringType"
                  value={formState.flooringType}
                  onChange={(event) => handleChange("flooringType", event.target.value)}
                >
                  <option value="Homogeneous">Homogeneous</option>
                  <option value="Heterogeneous">Heterogeneous</option>
                  <option value="SPC">SPC</option>
                  <option value="Vinyl">Vinyl</option>
                  <option value="Carpet">Carpet</option>
                  <option value="Wooden">Wooden</option>
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="areaSize">Area Size (sq.ft) *</label>
                <input
                  id="areaSize"
                  type="number"
                  min="0"
                  value={formState.areaSize}
                  onChange={(event) => handleChange("areaSize", event.target.value)}
                  onBlur={() => handleBlur("areaSize")}
                  placeholder="1200"
                />
                {touched.areaSize && errors.areaSize ? (
                  <span className={styles.error}>{errors.areaSize}</span>
                ) : null}
              </div>

              <div className={styles.field}>
                <label htmlFor="preferredDate">Preferred Date *</label>
                <input
                  id="preferredDate"
                  type="date"
                  value={formState.preferredDate}
                  onChange={(event) => handleChange("preferredDate", event.target.value)}
                  onBlur={() => handleBlur("preferredDate")}
                />
                {touched.preferredDate && errors.preferredDate ? (
                  <span className={styles.error}>{errors.preferredDate}</span>
                ) : null}
              </div>
            </div>

            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <label htmlFor="preferredTime">Preferred Time</label>
                <select
                  id="preferredTime"
                  value={formState.preferredTime}
                  onChange={(event) => handleChange("preferredTime", event.target.value)}
                >
                  <option value="Morning 8-12">Morning 8-12</option>
                  <option value="Afternoon 12-4">Afternoon 12-4</option>
                  <option value="Evening 4-8">Evening 4-8</option>
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="roomPhoto">Upload Room Photo (optional)</label>
                <input
                  id="roomPhoto"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    handleChange(
                      "roomPhotoName",
                      event.target.files?.[0]?.name ?? ""
                    )
                  }
                />
                {formState.roomPhotoName ? (
                  <span className={styles.helperText}>
                    Selected: {formState.roomPhotoName}
                  </span>
                ) : null}
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="notes">Notes (optional)</label>
              <textarea
                id="notes"
                rows={4}
                value={formState.notes}
                onChange={(event) => handleChange("notes", event.target.value)}
                placeholder="Share any access instructions or special requests..."
              />
            </div>

            <div className={styles.actions}>
              <button
                type="submit"
                className={styles.primaryButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Booking Request"}
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={handleClear}
              >
                Clear Form
              </button>
            </div>
          </form>
        </section>

        <aside className={styles.sidebar}>
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Booking Summary</h2>
              <p>Live preview of your request details.</p>
            </div>
            <div className={styles.summaryGrid}>
              <div>
                <span className={styles.summaryLabel}>Service</span>
                <strong>{summarySource.serviceType}</strong>
              </div>
              <div>
                <span className={styles.summaryLabel}>Flooring</span>
                <strong>{summarySource.flooringType}</strong>
              </div>
              <div>
                <span className={styles.summaryLabel}>Area</span>
                <strong>{summarySource.areaSize ? `${summarySource.areaSize} sq.ft` : "—"}</strong>
              </div>
              <div>
                <span className={styles.summaryLabel}>Schedule</span>
                <strong>
                  {summarySource.preferredDate
                    ? `${summarySource.preferredDate} • ${summarySource.preferredTime}`
                    : "—"}
                </strong>
              </div>
            </div>

            <div className={styles.priceBox}>
              <p className={styles.priceLabel}>Estimated price range</p>
              <p className={styles.priceValue}>
                {basePrice > 0
                  ? `NPR ${basePrice.toLocaleString()} - NPR ${Math.round(
                      basePrice * 1.2
                    ).toLocaleString()}`
                  : "Add area size to estimate"}
              </p>
              <span className={styles.helperText}>Final price after site visit.</span>
            </div>

            <div className={styles.previewBox}>
              <p className={styles.summaryLabel}>Booking preview</p>
              <pre className={styles.previewCode}>{JSON.stringify(bookingPreview, null, 2)}</pre>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Frequently Asked</h2>
              <p>Quick answers before you submit.</p>
            </div>
            <div className={styles.accordion}>
              {faqItems.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <button
                    key={item.title}
                    type="button"
                    className={styles.accordionItem}
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  >
                    <div className={styles.accordionHeader}>
                      <span>{item.title}</span>
                      <span className={styles.accordionIcon}>{isOpen ? "–" : "+"}</span>
                    </div>
                    {isOpen ? <p className={styles.accordionContent}>{item.content}</p> : null}
                  </button>
                );
              })}
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Need help?</h2>
              <p>We’re available to confirm your booking details.</p>
            </div>
            <div className={styles.contactBox}>
              <div>
                <span className={styles.summaryLabel}>Phone</span>
                <strong>+977 9800000000</strong>
              </div>
              <div>
                <span className={styles.summaryLabel}>Email</span>
                <strong>support@floorease.com</strong>
              </div>
              <div>
                <span className={styles.summaryLabel}>Hours</span>
                <strong>Sun–Fri, 9:00 AM – 6:00 PM</strong>
              </div>
            </div>
          </section>
        </aside>
      </main>

      {isModalOpen ? (
        <div className={styles.modalOverlay} role="presentation">
          <div
            className={styles.modalCard}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-success-title"
            aria-describedby="booking-success-message"
            ref={modalRef}
          >
            <div className={styles.successIcon} aria-hidden="true">
              ✅
            </div>
            <h3 id="booking-success-title" className={styles.modalTitle}>
              Congratulations
            </h3>
            <p id="booking-success-message" className={styles.modalMessage}>
              Your booking has been submitted successfully
            </p>
            <button
              type="button"
              className={styles.okButton}
              onClick={handleCloseModal}
              ref={okButtonRef}
            >
              OK
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
//