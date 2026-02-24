"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  requestPasswordReset,
  resetPassword,
  verifyResetOtp,
} from "@/lib/actions/auth-actions";
import styles from "./forgot-password.module.css";

type Step = "email" | "otp" | "reset" | "success";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<"email" | "otp" | "newPassword" | "confirmPassword", string>>
  >({});
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Simple email validation regex
  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setResendCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  const subtitle = useMemo(() => {
    if (step === "email")
      return "Enter your email address and we'll send a 6-digit OTP to reset your password.";
    if (step === "otp")
      return "Enter the 6-digit OTP sent to your email to verify your request.";
    if (step === "reset") return "Create a new password for your account.";
    return "Your password has been reset successfully.";
  }, [step]);

  const resetMessages = () => {
    setError("");
    setInfoMessage("");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setFieldErrors((prev) => ({ ...prev, email: "" }));
    resetMessages();
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    setFieldErrors((prev) => ({ ...prev, otp: "" }));
    resetMessages();
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setFieldErrors((prev) => ({ ...prev, newPassword: "" }));
    resetMessages();
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
    resetMessages();
  };

  const validateEmailField = () => {
    if (!email.trim()) return "Please enter your email address";
    if (!validateEmail(email)) return "Please enter a valid email address";
    return "";
  };

  const validateOtpField = () => {
    if (!otp.trim()) return "Please enter the OTP";
    if (!/^\d{6}$/.test(otp)) return "OTP must be 6 digits";
    return "";
  };

  const validatePasswordFields = ():
    | { field: "newPassword" | "confirmPassword"; message: string }
    | null => {
    if (!newPassword.trim())
      return { field: "newPassword", message: "Please enter a new password" };
    if (newPassword.length < 8)
      return {
        field: "newPassword",
        message: "Password must be at least 8 characters",
      };
    if (!confirmPassword.trim())
      return {
        field: "confirmPassword",
        message: "Please confirm your password",
      };
    if (newPassword !== confirmPassword)
      return { field: "confirmPassword", message: "Passwords do not match" };
    return null;
  };

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetMessages();

    const emailError = validateEmailField();
    if (emailError) {
      setFieldErrors((prev) => ({ ...prev, email: emailError }));
      return;
    }

    setLoading(true);
    try {
      const response = await requestPasswordReset({ email });
      if (response?.success === false) {
        setError(response?.message || "Failed to send OTP");
        return;
      }
      setInfoMessage(response?.message || "OTP sent to email");
      setStep("otp");
      setResendCooldown(60);
      setOtp("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetMessages();

    const otpError = validateOtpField();
    if (otpError) {
      setFieldErrors((prev) => ({ ...prev, otp: otpError }));
      return;
    }

    setLoading(true);
    try {
      const response = await verifyResetOtp({ email, otp });
      if (response?.success === false) {
        setError(response?.message || "Invalid or expired OTP");
        return;
      }
      setInfoMessage(response?.message || "OTP verified successfully");
      setStep("reset");
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    resetMessages();
    setLoading(true);
    try {
      const response = await requestPasswordReset({ email });
      if (response?.success === false) {
        setError(response?.message || "Failed to resend OTP");
        return;
      }
      setInfoMessage(response?.message || "OTP sent to email");
      setResendCooldown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetMessages();

    const passwordError = validatePasswordFields();
    if (passwordError) {
      setFieldErrors((prev) => ({
        ...prev,
        [passwordError.field]: passwordError.message,
      }));
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword({
        email,
        newPassword,
        confirmPassword,
      });
      if (response?.success === false) {
        setError(response?.message || "Password reset failed");
        return;
      }
      setInfoMessage(response?.message || "Password reset successful");
      setStep("success");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  const getInputClassName = (field?: string) => {
    if (field && fieldErrors[field as keyof typeof fieldErrors]) {
      return `${styles.input} ${styles.error}`;
    }
    return styles.input;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Forgot Password?</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </header>

        {step === "email" && (
          <form className={styles.form} onSubmit={handleEmailSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className={getInputClassName("email")}
                placeholder="you@example.com"
                value={email}
                onChange={handleEmailChange}
                disabled={loading}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
              />
              {fieldErrors.email && (
                <div
                  id="email-error"
                  className={styles.errorMessage}
                  role="alert"
                  aria-live="polite"
                >
                  {fieldErrors.email}
                </div>
              )}
            </div>

            {error && (
              <div className={styles.errorMessage} role="alert" aria-live="polite">
                {error}
              </div>
            )}

            {infoMessage && (
              <div className={styles.successMessage} role="status" aria-live="polite">
                {infoMessage}
              </div>
            )}

            <button
              type="submit"
              className={styles.button}
              disabled={loading}
              aria-busy={loading}
            >
              {loading && <div className={styles.spinner} />}
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form className={styles.form} onSubmit={handleVerifyOtp}>
            <div className={styles.formGroup}>
              <label htmlFor="otp" className={styles.label}>
                OTP Code
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                className={`${getInputClassName("otp")} ${styles.otpInput}`}
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={handleOtpChange}
                disabled={loading}
                aria-describedby={fieldErrors.otp ? "otp-error" : undefined}
              />
              {fieldErrors.otp && (
                <div
                  id="otp-error"
                  className={styles.errorMessage}
                  role="alert"
                  aria-live="polite"
                >
                  {fieldErrors.otp}
                </div>
              )}
            </div>

            {error && (
              <div className={styles.errorMessage} role="alert" aria-live="polite">
                {error}
              </div>
            )}

            {infoMessage && (
              <div className={styles.successMessage} role="status" aria-live="polite">
                {infoMessage}
              </div>
            )}

            <button
              type="submit"
              className={styles.button}
              disabled={loading}
              aria-busy={loading}
            >
              {loading && <div className={styles.spinner} />}
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className={styles.resendRow}>
              <button
                type="button"
                className={styles.linkButton}
                onClick={handleResendOtp}
                disabled={loading || resendCooldown > 0}
              >
                {resendCooldown > 0
                  ? `Resend OTP in ${resendCooldown}s`
                  : "Resend OTP"}
              </button>
              <button
                type="button"
                className={styles.linkButton}
                onClick={() => {
                  setStep("email");
                  resetMessages();
                }}
              >
                Change email
              </button>
            </div>
          </form>
        )}

        {step === "reset" && (
          <form className={styles.form} onSubmit={handleResetPassword}>
            <div className={styles.formGroup}>
              <label htmlFor="new-password" className={styles.label}>
                New Password
              </label>
              <div className={styles.passwordRow}>
                <input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  className={getInputClassName("newPassword")}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => setShowNewPassword((prev) => !prev)}
                >
                  {showNewPassword ? "🙈" : "👁"}
                </button>
              </div>
              {fieldErrors.newPassword && (
                <div className={styles.errorMessage} role="alert" aria-live="polite">
                  {fieldErrors.newPassword}
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirm-password" className={styles.label}>
                Confirm Password
              </label>
              <div className={styles.passwordRow}>
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  className={getInputClassName("confirmPassword")}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? "🙈" : "👁"}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <div className={styles.errorMessage} role="alert" aria-live="polite">
                  {fieldErrors.confirmPassword}
                </div>
              )}
            </div>

            {error && (
              <div className={styles.errorMessage} role="alert" aria-live="polite">
                {error}
              </div>
            )}

            {infoMessage && (
              <div className={styles.successMessage} role="status" aria-live="polite">
                {infoMessage}
              </div>
            )}

            <button
              type="submit"
              className={styles.button}
              disabled={loading}
              aria-busy={loading}
            >
              {loading && <div className={styles.spinner} />}
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {step === "success" && (
          <div className={styles.form}>
            <div className={styles.successMessage} role="status" aria-live="polite">
              {infoMessage || "Password reset successful. Redirecting to login..."}
            </div>
            <button
              type="button"
              className={styles.button}
              onClick={() => router.push("/login")}
            >
              Go to Login
            </button>
          </div>
        )}

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
