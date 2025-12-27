"use client";

import { useEffect } from "react";
import "./home.css";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    const button = document.querySelector(
      ".cta-button"
    ) as HTMLButtonElement;

    if (!button) return;

    const ripple = document.createElement("span");
    ripple.style.position = "absolute";
    ripple.style.borderRadius = "50%";
    ripple.style.background = "rgba(255, 255, 255, 0.3)";
    ripple.style.transform = "scale(0)";
    ripple.style.animation = "ripple 0.6s linear";
    ripple.style.left = "50%";
    ripple.style.top = "50%";
    ripple.style.width = "20px";
    ripple.style.height = "20px";
    ripple.style.marginLeft = "-10px";
    ripple.style.marginTop = "-10px";

    button.style.position = "relative";
    button.style.overflow = "hidden";
    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);

    // Navigate (you can change this)
    router.push("/login");
  };

  useEffect(() => {
    const button = document.querySelector(
      ".cta-button"
    ) as HTMLButtonElement;

    if (!button) return;

    const onEnter = () => {
      button.style.transform = "translateY(-2px) scale(1.02)";
    };

    const onLeave = () => {
      button.style.transform = "translateY(0) scale(1)";
    };

    button.addEventListener("mouseenter", onEnter);
    button.addEventListener("mouseleave", onLeave);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && document.activeElement === button) {
        handleGetStarted();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      button.removeEventListener("mouseenter", onEnter);
      button.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div className="container">
      <header className="header">
        <div className="logo">
          <svg
            className="logo-icon"
            viewBox="0 0 100 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 60 L20 20 L50 5 L80 20 L80 60 L20 60 Z"
              stroke="white"
              strokeWidth="3"
            />
            <path d="M30 35 L70 35" stroke="white" strokeWidth="2" />
            <path d="M30 45 L70 45" stroke="white" strokeWidth="2" />
            <path d="M30 55 L70 55" stroke="white" strokeWidth="2" />
            <circle cx="25" cy="25" r="3" fill="white" />
          </svg>
          <span className="logo-text">FloorEase</span>
        </div>
      </header>

      <main className="main-content">
        <div className="hero-section">
          <h1 className="hero-title">FloorEase</h1>
          <p className="hero-subtitle">
            Your Smart Flooring Companion
          </p>
          <button
            className="cta-button"
            onClick={handleGetStarted}
          >
            Get Start
          </button>
        </div>
      </main>
    </div>
  );
}
