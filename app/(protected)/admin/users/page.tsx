"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./users.module.css";

type ApiUser = {
  id?: string;
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  createdAt?: string;
  avatarUrl?: string | null;
};

type UserRow = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  avatarUrl?: string | null;
  createdAt?: string;
};

type UserDetails = {
  id: string;
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  mobileNumber?: string;
  gender?: string;
  address?: string;
  createdAt?: string;
  avatarUrl?: string | null;
  avatar?: string | null;
  profileImage?: string | null;
  image?: string | null;
  photo?: string | null;
};

const formatDate = (value?: string) => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString();
};

const getInitials = (firstName?: string, lastName?: string, email?: string) => {
  const name = `${firstName ?? ""} ${lastName ?? ""}`.trim();
  if (name) {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }
  if (email) return email[0]?.toUpperCase() ?? "U";
  return "U";
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [error, setError] = useState("");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    gender: "",
    address: "",
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      router.replace("/login");
      setIsChecking(false);
      return;
    }

    if (role !== "admin") {
      router.replace("/dashboard");
      setIsChecking(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        setError("");
        const response = await fetch("http://localhost:5050/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load users");
        }

        const payload = await response.json();
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload?.users)
              ? payload.users
              : [];

        const mapped = list
          .map((user: ApiUser) => {
            const id = user.id ?? user._id ?? "";
            const email = user.email ?? "";
            const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
            const name = fullName || email || "Unknown";
            if (!id) return null;
            return {
              id,
              name,
              email,
              createdAt: user.createdAt,
              avatarUrl: user.avatarUrl ?? null,
              avatar: `https://i.pravatar.cc/80?u=${encodeURIComponent(id || email)}`,
            };
          })
          .filter(Boolean) as UserRow[];

        if (isMounted) {
          setUsers(mapped);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load users");
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (!successMsg) return;
    const timer = window.setTimeout(() => {
      setSuccessMsg("");
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [successMsg]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure?");
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5050/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  const openView = async (userId: string) => {
    setModalMode("view");
    setSuccessMsg("");
    setAvatarError(false);
    setIsViewOpen(true);
    setIsLoadingUser(true);
    setViewError(null);
    setSelectedUser(null);

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5050/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load user details");
      }

      const payload = await response.json();
      const data = payload?.data ?? payload?.user ?? payload;
      if (!data) {
        throw new Error("User details unavailable");
      }

      const mappedUser: UserDetails = {
        id: data.id ?? data._id ?? userId,
        _id: data._id ?? data.id ?? userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone ?? data.mobileNumber,
        mobileNumber: data.mobileNumber,
        gender: data.gender,
        address: data.address,
        createdAt: data.createdAt,
        avatarUrl: data.avatarUrl ?? null,
      };

      setSelectedUser(mappedUser);
      setEditForm({
        firstName: mappedUser.firstName ?? "",
        lastName: mappedUser.lastName ?? "",
        email: mappedUser.email ?? "",
        mobileNumber: mappedUser.mobileNumber ?? mappedUser.phone ?? "",
        gender: mappedUser.gender ?? "",
        address: mappedUser.address ?? "",
      });
    } catch (err) {
      setViewError(err instanceof Error ? err.message : "Failed to load user details");
    } finally {
      setIsLoadingUser(false);
    }
  };

  const openEdit = async (userId: string) => {
    setModalMode("edit");
    setSuccessMsg("");
    await openView(userId);
    setModalMode("edit");
  };

  const closeView = () => {
    setIsViewOpen(false);
    setSelectedUser(null);
    setViewError(null);
    setAvatarError(false);
    setSuccessMsg("");
    setIsSavingEdit(false);
  };

  const getAvatarSrc = (user: UserDetails | null) => {
    if (!user) return null;
    const rawSrc =
      user.avatarUrl ??
      user.avatar ??
      user.profileImage ??
      user.image ??
      user.photo ??
      null;
    if (!rawSrc) return null;
    if (rawSrc.startsWith("http")) return rawSrc;
    const API_BASE = "http://localhost:5050";
    const normalized = rawSrc.startsWith("/") ? rawSrc : `/${rawSrc}`;
    return `${API_BASE}${normalized}`;
  };

  const handleEditChange = (field: keyof typeof editForm, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveUserChanges = async () => {
    if (!selectedUser || !selectedUser._id) return;
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    setIsSavingEdit(true);
    setSuccessMsg("");
    setViewError(null);

    try {
      const response = await fetch(
        `http://localhost:5050/api/admin/users/${selectedUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: editForm.firstName.trim(),
            lastName: editForm.lastName.trim(),
            mobileNumber: editForm.mobileNumber.trim(),
            gender: editForm.gender.trim(),
            address: editForm.address.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const payload = await response.json();
      const data = payload?.data?.data ?? payload?.data ?? payload?.user ?? payload ?? {};
      const updatedUser: UserDetails = {
        id: data.id ?? data._id ?? selectedUser.id,
        _id: data._id ?? data.id ?? selectedUser._id,
        firstName: data.firstName ?? editForm.firstName,
        lastName: data.lastName ?? editForm.lastName,
        email: data.email ?? editForm.email,
        phone: data.phone ?? data.mobileNumber ?? editForm.mobileNumber,
        mobileNumber: data.mobileNumber ?? editForm.mobileNumber,
        gender: data.gender ?? editForm.gender,
        address: data.address ?? editForm.address,
        createdAt: data.createdAt ?? selectedUser.createdAt,
        avatarUrl: data.avatarUrl ?? null,
      };

      setSelectedUser(updatedUser);
      setEditForm({
        firstName: updatedUser.firstName ?? "",
        lastName: updatedUser.lastName ?? "",
        email: updatedUser.email ?? "",
        mobileNumber: updatedUser.mobileNumber ?? updatedUser.phone ?? "",
        gender: updatedUser.gender ?? "",
        address: updatedUser.address ?? "",
      });

      setUsers((prev) =>
        prev.map((user) => {
          if (user.id !== updatedUser.id) return user;
          const fullName = `${updatedUser.firstName ?? ""} ${updatedUser.lastName ?? ""}`.trim();
          const name = fullName || updatedUser.email || user.name;
          return {
            ...user,
            name,
            email: updatedUser.email ?? user.email,
            avatarUrl: updatedUser.avatarUrl ?? user.avatarUrl ?? null,
          };
        })
      );

      setSuccessMsg("Changes saved successfully.");
      setModalMode("view");
    } catch (err) {
      setViewError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setIsSavingEdit(false);
    }
  };

  if (isChecking) {
    return <div className={styles.page}>Loading...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <button type="button" className={styles.backButton} onClick={() => router.push("/admin")}>
          ← Back to Admin Dashboard
        </button>
      </div>

      <header className={styles.header}>
        <h1 className={styles.title}>Users</h1>
        {error && <p className={styles.muted}>{error}</p>}
      </header>

      <section className={styles.card}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Date Created</th>
                <th>Role</th>
                <th className={styles.actionCol}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td className={styles.indexCell}>{index + 1}</td>
                  <td>
                    <div className={styles.nameCell}>
                      <img
                        className={styles.avatar}
                        src={user.avatarUrl || user.avatar}
                        alt={user.name}
                      />
                      <span className={styles.name}>{user.name}</span>
                    </div>
                  </td>
                  <td className={styles.muted}>{formatDate(user.createdAt)}</td>
                  <td>
                    <span className={styles.roleBadge}>User</span>
                  </td>
                  <td className={styles.actionCol}>
                    <div className={styles.actionButtons}>
                      <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={() => openView(user.id)}
                        title="View User"
                        aria-label={`View ${user.name}`}
                      >
                        👁️
                      </button>
                      <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={() => openEdit(user.id)}
                        title="Edit User"
                        aria-label={`Edit ${user.name}`}
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={() => handleDelete(user.id)}
                        title="Delete User"
                        aria-label={`Delete ${user.name}`}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isViewOpen && (
        <div className={styles.overlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h2>User Details</h2>
              <button type="button" className={styles.closeButton} onClick={closeView}>
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              {isLoadingUser && <p className={styles.muted}>Loading user details...</p>}
              {viewError && <p className={styles.muted}>{viewError}</p>}
              {successMsg && <p className={styles.muted}>{successMsg}</p>}

              {!isLoadingUser && !viewError && selectedUser && (
                <>
                  <div className={styles.profileRow}>
                    {getAvatarSrc(selectedUser) && !avatarError ? (
                      <img
                        className={styles.profileAvatar}
                        src={getAvatarSrc(selectedUser) ?? ""}
                        alt={selectedUser.email ?? "User"}
                        onError={() => setAvatarError(true)}
                      />
                    ) : (
                      <div className={styles.profileAvatarFallback}>
                        {getInitials(
                          selectedUser.firstName,
                          selectedUser.lastName,
                          selectedUser.email
                        )}
                      </div>
                    )}
                    <div className={styles.profileInfo}>
                      <h3>
                        {`${selectedUser.firstName ?? ""} ${selectedUser.lastName ?? ""}`.trim() ||
                          selectedUser.email ||
                          "Unknown"}
                      </h3>
                      <p>{selectedUser.email ?? "—"}</p>
                    </div>
                  </div>

                  <div className={styles.fieldGrid}>
                    <div className={styles.field}>
                      <span className={styles.fieldLabel}>First Name</span>
                      {modalMode === "edit" ? (
                        <input
                          className={styles.input}
                          value={editForm.firstName}
                          onChange={(event) => handleEditChange("firstName", event.target.value)}
                        />
                      ) : (
                        <span className={styles.fieldValue}>{selectedUser.firstName ?? "—"}</span>
                      )}
                    </div>
                    <div className={styles.field}>
                      <span className={styles.fieldLabel}>Last Name</span>
                      {modalMode === "edit" ? (
                        <input
                          className={styles.input}
                          value={editForm.lastName}
                          onChange={(event) => handleEditChange("lastName", event.target.value)}
                        />
                      ) : (
                        <span className={styles.fieldValue}>{selectedUser.lastName ?? "—"}</span>
                      )}
                    </div>
                    <div className={styles.field}>
                      <span className={styles.fieldLabel}>Email</span>
                      {modalMode === "edit" ? (
                        <input
                          className={styles.input}
                          value={editForm.email}
                          onChange={(event) => handleEditChange("email", event.target.value)}
                          readOnly
                        />
                      ) : (
                        <span className={styles.fieldValue}>{selectedUser.email ?? "—"}</span>
                      )}
                    </div>
                    <div className={styles.field}>
                      <span className={styles.fieldLabel}>Mobile Number</span>
                      {modalMode === "edit" ? (
                        <input
                          className={styles.input}
                          value={editForm.mobileNumber}
                          onChange={(event) =>
                            handleEditChange("mobileNumber", event.target.value)
                          }
                        />
                      ) : (
                        <span className={styles.fieldValue}>
                          {selectedUser.mobileNumber ?? selectedUser.phone ?? "—"}
                        </span>
                      )}
                    </div>
                    <div className={styles.field}>
                      <span className={styles.fieldLabel}>Gender</span>
                      {modalMode === "edit" ? (
                        <input
                          className={styles.input}
                          value={editForm.gender}
                          onChange={(event) => handleEditChange("gender", event.target.value)}
                        />
                      ) : (
                        <span className={styles.fieldValue}>{selectedUser.gender ?? "—"}</span>
                      )}
                    </div>
                    <div className={styles.field}>
                      <span className={styles.fieldLabel}>Address</span>
                      {modalMode === "edit" ? (
                        <textarea
                          className={styles.textarea}
                          rows={3}
                          value={editForm.address}
                          onChange={(event) => handleEditChange("address", event.target.value)}
                        />
                      ) : (
                        <span className={styles.fieldValue}>{selectedUser.address ?? "—"}</span>
                      )}
                    </div>
                    <div className={styles.field}>
                      <span className={styles.fieldLabel}>Created Date</span>
                      {modalMode === "edit" ? (
                        <input
                          className={styles.input}
                          value={formatDate(selectedUser.createdAt)}
                          readOnly
                        />
                      ) : (
                        <span className={styles.fieldValue}>
                          {formatDate(selectedUser.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {modalMode === "edit" && (
                    <div className={styles.modalActions}>
                      <button type="button" className={styles.modalButton} onClick={closeView}>
                        Cancel
                      </button>
                      <button
                        type="button"
                        className={styles.modalPrimaryButton}
                        onClick={handleSaveUserChanges}
                        disabled={isSavingEdit}
                      >
                        {isSavingEdit ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
//