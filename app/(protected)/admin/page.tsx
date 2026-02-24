"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./admin.module.css";

type AdminCard = {
  title: "Bookings" | "UserProfile";
  href: string;
  icon: string;
};

const cards: AdminCard[] = [
  { title: "Bookings", href: "/admin/bookings", icon: "📅" },
  { title: "UserProfile", href: "/admin/users", icon: "👤" },
];

export default function AdminPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
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

    setIsChecking(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    router.push("/login");
  };

  if (isChecking) {
    return <div className={styles.page}>Loading...</div>;
  }

  return (
    <div className={styles.page}>
      <nav className={styles.topNav}>
        <div className={styles.logo}>FloorEase Admin</div>
        <button
          className={styles.menuButton}
          onClick={() => setShowSidebar(!showSidebar)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <div className={styles.navCenter}>
          <Link
            className={`${styles.navLink} ${pathname === "/admin" ? styles.navLinkActive : ""}`}
            href="/admin"
          >
            Dashboard
          </Link>
          <Link
            className={`${styles.navLink} ${pathname.startsWith("/admin/bookings") ? styles.navLinkActive : ""}`}
            href="/admin/bookings"
          >
            Bookings
          </Link>
          <Link
            className={`${styles.navLink} ${pathname.startsWith("/admin/users") ? styles.navLinkActive : ""}`}
            href="/admin/users"
          >
            UserProfile
          </Link>
        </div>

        <input className={styles.searchBox} placeholder="Search..." />

        <span className={styles.adminPill}>ADMIN</span>
      </nav>

      {showSidebar && (
        <div className={styles.backdrop} onClick={() => setShowSidebar(false)} />
      )}

      <div className={styles.container}>
        <aside className={`${styles.sidebar} ${showSidebar ? styles.open : ""}`}>
          <button
            className={`${styles.navItem} ${pathname === "/admin" ? styles.sidebarActive : ""}`}
            onClick={() => {
              router.push("/admin");
              setShowSidebar(false);
            }}
          >
            Dashboard
          </button>
          <button
            className={`${styles.navItem} ${pathname.startsWith("/admin/bookings") ? styles.sidebarActive : ""}`}
            onClick={() => {
              router.push("/admin/bookings");
              setShowSidebar(false);
            }}
          >
            Bookings
          </button>
          <button
            className={`${styles.navItem} ${pathname.startsWith("/admin/users") ? styles.sidebarActive : ""}`}
            onClick={() => {
              router.push("/admin/users");
              setShowSidebar(false);
            }}
          >
            UserProfile
          </button>
          <button
            className={`${styles.sidebarButton} ${styles.logout}`}
            onClick={handleLogout}
          >
            Logout
          </button>
        </aside>

        <main className={styles.main}>
          <h1 className={styles.header}>Admin Dashboard</h1>

          <div className={styles.cardsGrid}>
            {cards.map((card) => (
              <div
                key={card.title}
                className={styles.card}
                onClick={() => router.push(card.href)}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.cardBody}>
                  <div className={styles.cardIcon}>{card.icon}</div>
                  <p className={styles.cardTitle}>{card.title}</p>
                </div>
              </div>
            ))}
          </div>

          <section className={styles.overviewSection}>
            <div className={styles.overviewHeader}>Quick Overview</div>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Total Bookings</span>
                <div className={styles.statValue}>📅 42</div>
                <span className={styles.statMeta}>Updated just now</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Total Users</span>
                <div className={styles.statValue}>👥 128</div>
                <span className={styles.statMeta}>Updated just now</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Pending Requests</span>
                <div className={styles.statValue}>⏳ 7</div>
                <span className={styles.statMeta}>Updated just now</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}