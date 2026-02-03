"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./forgot-password.module.css";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Simple email validation regex
  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validate email
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success - show message
      setSuccess(true);
      setEmail("");

      // Redirect to login after 2.5 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err) {
      setError("Failed to send reset link. Please try again.");
      setLoading(false);
    }
  };

  const getInputClassName = () => {
    if (success) return `${styles.input} ${styles.success}`;
    if (error) return `${styles.input} ${styles.error}`;
    return styles.input;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Forgot Password?</h1>
          <p className={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className={getInputClassName()}
              placeholder="you@example.com"
              value={email}
              onChange={handleChange}
              disabled={loading || success}
              aria-describedby={error ? "email-error" : undefined}
            />
            {error && (
              <div
                id="email-error"
                className={styles.errorMessage}
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}
          </div>

          {success && (
            <div
              className={styles.successMessage}
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              ✓ Reset link sent! Check your email. Redirecting to login...
            </div>
          )}

          <button
            type="submit"
            className={styles.button}
            disabled={loading || success}
            aria-busy={loading}
          >
            {loading && <div className={styles.spinner} />}
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className={styles.backLink}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => router.push("/login")}
            aria-label="Return to login page"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
