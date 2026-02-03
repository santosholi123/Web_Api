"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/actions/auth-actions";
import styles from "../register/register.module.css";

export function SignupForm() {
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
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

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
        if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, "")))
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
    setSuccessMessage("");
    setErrorMessage("");

    const newErrors: Record<string, string> = {};
    Object.entries(form).forEach(([k, v]) => {
      const msg = validateField(k, v);
      if (msg) newErrors[k] = msg;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      await registerUser({ email: form.email, password: form.password });

      // Clear form
      setForm({
        fullName: "",
        mobile: "",
        email: "",
        password: "",
      });
      setErrors({});

      // Show success message
      setSuccessMessage("Signup successful ✅ Please login.");

      // Redirect to login after success
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Request failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <div className={styles.formContent}>
          <h1>Create Account</h1>
          <p className={styles.subtitle}>
            Smart Floors. Smart Choice. FloorEase.
          </p>

          <form className={styles.signupForm} onSubmit={handleSubmit}>
            {/* Full Name */}
            <div
              className={`${styles.formGroup} ${
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
                <div className={styles.errorMessage}>
                  {errors.fullName}
                </div>
              )}
            </div>

            {/* Mobile */}
            <div
              className={`${styles.formGroup} ${
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
                <div className={styles.errorMessage}>
                  {errors.mobile}
                </div>
              )}
            </div>

            {/* Email */}
            <div
              className={`${styles.formGroup} ${
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
                <div className={styles.errorMessage}>
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password */}
            <div
              className={`${styles.formGroup} ${
                errors.password
                  ? styles.error
                  : form.password
                  ? styles.success
                  : ""
              }`}
            >
              <label>Password</label>

              <div className={styles.passwordInput}>
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
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword((p) => !p)}
                >
                  👁
                </button>
              </div>

              {errors.password && (
                <div className={styles.errorMessage}>
                  {errors.password}
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`${styles.getStartedBtn} ${
                loading ? styles.loading : ""
              }`}
              disabled={loading}
            >
              {loading ? "Creating..." : "Get Start"}
            </button>

            {successMessage && (
              <div
                style={{
                  color: "#10b981",
                  fontSize: "0.9rem",
                  marginTop: "12px",
                  fontWeight: "500",
                  textAlign: "center",
                }}
              >
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div
                style={{
                  color: "#f87171",
                  fontSize: "0.9rem",
                  marginTop: "12px",
                  textAlign: "center",
                }}
              >
                {errorMessage}
              </div>
            )}
          </form>

          <div className={styles.loginLink}>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className={styles.loginBtn}
            >
              Log in
            </button>
          </div>
        </div>
      </div>

      <div className={styles.imageSection}>
        <img
          className={styles.backgroundImage}
          src="https://images.pexels.com/photos/159607/basketball-player-girls-basketball-girl-159607.jpeg"
          alt="Background"
        />
      </div>
    </div>
  );
}
