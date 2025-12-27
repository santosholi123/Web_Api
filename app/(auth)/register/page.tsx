"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./register.module.css";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    let formatted = value;
    if (name === "mobile") {
      const digits = value.replace(/\D/g, "");
      if (digits.length <= 3) formatted = digits;
      else if (digits.length <= 6)
        formatted = digits.slice(0, 3) + " " + digits.slice(3);
      else
        formatted =
          digits.slice(0, 3) +
          " " +
          digits.slice(3, 6) +
          " " +
          digits.slice(6, 10);
    }

    setForm((p) => ({ ...p, [name]: formatted }));
  }

  function validateField(name: string, value: string) {
    let message = "";

    switch (name) {
      case "fullName":
        if (value.trim().length < 2)
          message = "Full name must be at least 2 characters long";
        break;

      case "mobile":
        if (!/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, "")))
          message = "Please enter a valid mobile number";
        break;

      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          message = "Please enter a valid email address";
        break;

      case "password":
        if (value.length < 8)
          message = "Password must be at least 8 characters long";
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value))
          message =
            "Password must contain uppercase, lowercase, and number";
        break;
    }

    return message;
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setErrors((p) => ({ ...p, [name]: validateField(name, value) }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    Object.entries(form).forEach(([k, v]) => {
      const msg = validateField(k, v);
      if (msg) newErrors[k] = msg;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    // simulate API
    setTimeout(() => {
      setLoading(false);

      alert("Account created successfully! Welcome to FloorEase.");

      setForm({
        fullName: "",
        mobile: "",
        email: "",
        password: "",
      });

      setErrors({});

      // ✅ REDIRECT TO LOGIN
      router.push("/login");
    }, 2000);
  }

  return (
    <div className={styles.container}>
      <div className={styles["form-section"]}>
        <div className={styles["form-content"]}>
          <h1>Create Account</h1>
          <p className={styles.subtitle}>
            Smart Floors. Smart Choice. FloorEase.
          </p>

          <form
            className={styles["signup-form"]}
            onSubmit={handleSubmit}
          >
            {/* Full Name */}
            <div
              className={`${styles["form-group"]} ${
                errors.fullName
                  ? styles.error
                  : form.fullName
                  ? styles.success
                  : ""
              }`}
            >
              <label>Full Name</label>
              <input
                name="fullName"
                placeholder="Enter Your Full Name"
                value={form.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.fullName && (
                <div className={styles["error-message"]}>
                  {errors.fullName}
                </div>
              )}
            </div>

            {/* Mobile */}
            <div
              className={`${styles["form-group"]} ${
                errors.mobile
                  ? styles.error
                  : form.mobile
                  ? styles.success
                  : ""
              }`}
            >
              <label>Mobile Number</label>
              <input
                name="mobile"
                placeholder="Enter mobile number"
                value={form.mobile}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.mobile && (
                <div className={styles["error-message"]}>
                  {errors.mobile}
                </div>
              )}
            </div>

            {/* Email */}
            <div
              className={`${styles["form-group"]} ${
                errors.email
                  ? styles.error
                  : form.email
                  ? styles.success
                  : ""
              }`}
            >
              <label>Email</label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.email && (
                <div className={styles["error-message"]}>
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password */}
            <div
              className={`${styles["form-group"]} ${
                errors.password
                  ? styles.error
                  : form.password
                  ? styles.success
                  : ""
              }`}
            >
              <label>Password</label>

              <div className={styles["password-input"]}>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a secure password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <button
                  type="button"
                  className={styles["password-toggle"]}
                  onClick={() => setShowPassword((p) => !p)}
                >
                  👁
                </button>
              </div>

              {errors.password && (
                <div className={styles["error-message"]}>
                  {errors.password}
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`${styles["get-started-btn"]} ${
                loading ? styles.loading : ""
              }`}
              disabled={loading}
            >
              {loading ? "" : "Get Start"}
            </button>
          </form>

          {/* ✅ LOGIN LINK FIXED */}
          <div className={styles["login-link"]}>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className={styles["login-btn"]}
            >
              Log in
            </button>
          </div>
        </div>
      </div>

      <div className={styles["image-section"]}>
        <img
          className={styles["background-image"]}
          src="https://images.pexels.com/photos/159607/basketball-player-girls-basketball-girl-159607.jpeg"
          alt="Background"
        />
      </div>
    </div>
  );
}
