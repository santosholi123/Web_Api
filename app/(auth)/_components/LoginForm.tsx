"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/actions/auth-actions";
import { api } from "@/lib/api/axios";
import styles from "../login/login.module.css";

export function LoginForm() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const isAdminLogin =
        email === "santosholi@gmail.com" && password === "admin@123";

      if (isAdminLogin) {
        const response = await api.post("/api/admin/login", { email, password });
        const data = response?.data;

        if (data?.success === false) {
          setError(data?.message || "Login failed");
          return;
        }

        const token = data?.data?.token ?? data?.token;

        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("role", "admin");
          localStorage.setItem("email", email);
          document.cookie = `token=${token}; path=/`;
        }

        router.push("/admin");
        return;
      }

      const response = await loginUser({ email, password });

      if (response?.success === false) {
        setError(response?.message || "Login failed");
        return;
      }

      const token = response?.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        document.cookie = `token=${token}; path=/`;
      }
      if (response?.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.container}>
        <div className={styles.loginCard}>
          <header className={styles.header}>
            <h1 className={styles.welcomeTitle}>Welcome Back!</h1>
            <p className={styles.subtitle}>Login to your FloorEase account</p>
          </header>

          <form className={styles.loginForm} onSubmit={handleSubmit}>
            {error && (
              <div style={{ color: "#f87171", fontSize: "0.9rem", marginBottom: "16px" }}>
                {error}
              </div>
            )}

            <div
              className={styles.inputGroup}
              onFocus={(e) =>
                ((e.currentTarget as HTMLDivElement).style.transform = "scale(1.02)")
              }
              onBlur={(e) =>
                ((e.currentTarget as HTMLDivElement).style.transform = "scale(1)")
              }
            >
              <input
                type="email"
                id="email"
                placeholder="Email"
                className={styles.inputField}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div
              className={styles.inputGroup}
              onFocus={(e) =>
                ((e.currentTarget as HTMLDivElement).style.transform = "scale(1.02)")
              }
              onBlur={(e) =>
                ((e.currentTarget as HTMLDivElement).style.transform = "scale(1)")
              }
            >
              <div className={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  className={`${styles.inputField} ${styles.passwordInput}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <div className={styles.forgotPassword}>
              <button
                type="button"
                className={styles.forgotLink}
                onClick={() => router.push("/forgot-password")}
              >
                Reset Password?
              </button>
            </div>

            <button
              type="submit"
              className={`${styles.loginButton} ${loading ? styles.loading : ""}`}
              disabled={loading}
            >
              {loading ? "Logging In..." : "Log In"}
            </button>

            <div className={styles.signupLink}>
              <span>Not a member? </span>
              <button
                type="button"
                className={styles.createLink}
                onClick={() => router.push("/register")}
              >
                Create now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
