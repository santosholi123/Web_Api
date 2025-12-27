"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const inputs = document.querySelectorAll(".input-field");

    inputs.forEach((field) => {
      field.addEventListener("focus", () => {
        (field.parentElement as HTMLElement).style.transform = "scale(1.02)";
      });

      field.addEventListener("blur", () => {
        (field.parentElement as HTMLElement).style.transform = "scale(1)";
      });
    });

    return () => {
      inputs.forEach((field) => {
        field.replaceWith(field.cloneNode(true));
      });
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    // ✅ Simulate login API
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard"); // ✅ GO TO DASHBOARD
    }, 1500);
  };

  return (
    <div className="container">
      <div className="login-card">
        <header className="header">
          <h1 className="welcome-title">Welcome Back!</h1>
          <p className="subtitle">Login to your FloorEase account</p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="input-field"
              required
            />
          </div>

          <div className="input-group">
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                className="input-field password-input"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" stroke="currentColor" fill="none">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" stroke="currentColor" fill="none">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="forgot-password">
            <button
              type="button"
              className="forgot-link"
              onClick={() => alert("Forgot password coming soon")}
            >
              Reset Password?
            </button>
          </div>

          <button
            type="submit"
            className={`login-button ${loading ? "loading" : ""}`}
          >
            {loading ? "Logging In..." : "Log In"}
          </button>

          <div className="signup-link">
            <span>Not a member? </span>
            <button
              type="button"
              className="create-link"
              onClick={() => router.push("/register")}
            >
              Create now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
