"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/axios";
import { ENDPOINTS } from "@/lib/api/endpoints";
import styles from "../profile.module.css";

type User = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  mobileNumber?: string;
  gender?: "male" | "female" | "";
  address?: string;
  avatarUrl?: string | null;
};

type ApiUserResponse = {
  user?: User;
  message?: string;
} & User;

const getToken = () => {
  if (typeof document === "undefined") return null;
  const cookieMatch = document.cookie.match(/(?:^|; )token=([^;]*)/);
  if (cookieMatch?.[1]) return decodeURIComponent(cookieMatch[1]);
  return localStorage.getItem("token");
};

const readUserFromStorage = (): User | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

const mapCountryToPrefix = (value: string) => {
  if (value === "NP") return "+977";
  return value;
};

const mapPrefixToCountry = (value: string) => {
  if (value === "+977") return "NP";
  return value;
};

const resolveAvatarUrl = (url?: string | null) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "";
  if (!base) return url;
  return `${base.replace(/\/$/, "")}${url.startsWith("/") ? "" : "/"}${url}`;
};

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === "object") {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data
      ?.message;
    if (message) return message;
  }
  return fallback;
};

export default function ProfileForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [gender, setGender] = useState<User["gender"]>("");
  const [address, setAddress] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const displayAvatar = avatarPreview || resolveAvatarUrl(avatarUrl);

  const initials = useMemo(() => {
    const first = firstName?.trim().charAt(0) || "";
    const last = lastName?.trim().charAt(0) || "";
    return `${first}${last}`.toUpperCase() || "U";
  }, [firstName, lastName]);

  const updateFromUser = (user?: User | null) => {
    if (!user) return;
    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
    setEmail(user.email ?? "");
    setGender(user.gender ?? "");
    setAddress(user.address ?? "");
    setAvatarUrl(user.avatarUrl ?? null);

    const incomingPhone = user.mobileNumber ?? user.phone ?? "";
    if (incomingPhone) {
      const match = incomingPhone.trim().match(/^(\+\d+)\s+(.*)$/);
      if (match) {
        setCountryCode(mapPrefixToCountry(match[1]));
        setMobileNumber(match[2]);
      } else {
        setMobileNumber(incomingPhone);
      }
    } else {
      setMobileNumber("");
    }
  };

  const persistUser = (updates: Partial<User>) => {
    const current = readUserFromStorage() ?? {};
    const next = { ...current, ...updates };
    localStorage.setItem("user", JSON.stringify(next));
    return next;
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    setIsReady(true);

    const storedUser = readUserFromStorage();
    if (storedUser) {
      updateFromUser(storedUser);
    }

    const fetchUser = async () => {
      try {
        const response = await api.get<ApiUserResponse>(ENDPOINTS.USER.PROFILE, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        const user = data.user ?? data;
        updateFromUser(user);
        persistUser(user);
      } catch {
        // Ignore refresh errors
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const normalizedPhone = () => {
    const trimmed = mobileNumber.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("+")) return trimmed;
    return `${mapCountryToPrefix(countryCode)} ${trimmed}`;
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    setIsSaving(true);
    try {
      const response = await api.put<ApiUserResponse>(
        ENDPOINTS.USER.UPDATE,
        {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        mobileNumber: normalizedPhone(),
        gender,
        address: address.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      const updatedUser = data?.user ?? data ?? null;
      if (updatedUser) {
        updateFromUser(updatedUser);
        persistUser(updatedUser);
      } else {
        persistUser({
          firstName,
          lastName,
          mobileNumber: normalizedPhone(),
          gender,
          address,
        });
      }

      setErrorMessage("");
      setSuccessMessage("Profile updated successfully");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Unable to update profile."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setErrorMessage("");
    setSuccessMessage("");
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    const token = getToken();
    if (!token) {
      setErrorMessage("Unable to upload avatar.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await api.post<ApiUserResponse>(ENDPOINTS.USER.AVATAR, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;
      const updatedUser = data?.user ?? null;
      const newAvatarUrl = updatedUser?.avatarUrl || "";
      setAvatarUrl(newAvatarUrl);
      setAvatarPreview(resolveAvatarUrl(newAvatarUrl));
      if (updatedUser) {
        persistUser(updatedUser);
      } else if (newAvatarUrl) {
        persistUser({ avatarUrl: newAvatarUrl });
      }
      setErrorMessage("");
      setSuccessMessage("Avatar updated successfully");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Unable to upload avatar."));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteAvatar = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    const token = getToken();
    if (!token) {
      setErrorMessage("Unable to delete avatar.");
      return;
    }

    setIsUploading(true);
    try {
      const response = await api.delete<ApiUserResponse>(ENDPOINTS.USER.AVATAR);
      const data = response.data;
      const updatedUser = data?.user ?? null;
      setAvatarPreview(null);
      setAvatarUrl(updatedUser?.avatarUrl ?? null);
      if (updatedUser) {
        persistUser(updatedUser);
      } else {
        persistUser({ avatarUrl: null });
      }
      setErrorMessage("");
      setSuccessMessage("Avatar deleted successfully");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Unable to delete avatar."));
    } finally {
      setIsUploading(false);
    }
  };

  if (!isReady) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.avatarSection}>
        <div className={styles.avatar}>
          {displayAvatar ? (
            <img className={styles.avatarImage} src={displayAvatar} alt="Profile" />
          ) : (
            <div className={styles.avatarFallback}>{initials}</div>
          )}
          <button
            type="button"
            className={styles.cameraBtn}
            onClick={handleAvatarClick}
            aria-label="Change avatar"
          >
            📷
          </button>
        </div>

        <div className={styles.avatarActions}>
          <button
            type="button"
            className={styles.uploadBtn}
            onClick={handleAvatarClick}
            disabled={isUploading}
          >
            Upload New
          </button>
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={handleDeleteAvatar}
            disabled={isUploading}
          >
            Delete avatar
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
        className={styles.hiddenInput}
      />

      <form className={styles.form} onSubmit={handleSave}>
        {successMessage && <div className={styles.success}>{successMessage}</div>}
        {errorMessage && <div className={styles.error}>{errorMessage}</div>}

        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label className={styles.label}>
              First Name <span className={styles.required}>*</span>
            </label>
            <input
              className={styles.input}
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
              placeholder="John"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Last Name <span className={styles.required}>*</span>
            </label>
            <input
              className={styles.input}
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
              placeholder="Doe"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input className={styles.input} value={email} readOnly />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Mobile Number <span className={styles.required}>*</span>
            </label>
            <div className={styles.phoneRow}>
              <select
                className={styles.select}
                value={countryCode}
                onChange={(event) => setCountryCode(event.target.value)}
                aria-label="Country code"
              >
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+91">🇮🇳 +91</option>
                <option value="+61">🇦🇺 +61</option>
                  <option value="NP">🇳🇵 +977</option>
              </select>
              <input
                className={styles.input}
                value={mobileNumber}
                onChange={(event) => setMobileNumber(event.target.value)}
                required
                placeholder="(000) 000-0000"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Gender</label>
            <div className={styles.genderGroup}>
              <label className={styles.genderCard}>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={() => setGender("male")}
                />
                <span>Male</span>
              </label>
              <label className={styles.genderCard}>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={() => setGender("female")}
                />
                <span>Female</span>
              </label>
            </div>
          </div>

          <div className={styles.field} />

          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label className={styles.label}>Address</label>
            <textarea
              className={styles.textarea}
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              rows={4}
              placeholder="Street, City, State"
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button className={styles.saveBtn} type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </form>
    </div>
  );
}
