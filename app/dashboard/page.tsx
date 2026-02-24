"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./dashboard.module.css";


export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [hasToken, setHasToken] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const routeMap: Record<string, string> = {
    "Homogeneous Flooring": "/products/homogeneous",
    "Heterogeneous Flooring": "/products/heterogeneous",
    "Sports Flooring": "/products/sports",
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      setHasToken(false);
      setIsChecking(false);
      return;
    }

    setHasToken(true);
    setIsChecking(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; Max-Age=0; path=/";
    router.replace("/login");
  };

  const cards = [
    {
      title: "Homogeneous Flooring",
      category: "homogeneous",
      image: "https://images.pexels.com/photos/7534211/pexels-photo-7534211.jpeg",
    },
    {
      title: "Heterogeneous Flooring",
      category: "heterogeneous",
      image: "https://images.pexels.com/photos/4483773/pexels-photo-4483773.jpeg",
    },
    {
      title: "Sports Flooring",
      category: "sports",
      image: "sports",
    },
  ];

  const filteredCards = cards.filter((card) => {
    const matchesTab = activeTab === "all" || card.category === activeTab;
    const matchesSearch = card.title.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (isChecking) {
    return <div>Loading...</div>;
  }

  if (!hasToken) {
    return null;
  }

  return (
    <div className={styles.page}>
      {/* Top Nav */}
      <nav className={styles.topNav}>
        <div className={styles.logo}>FloorEase</div>
        <button
          className={styles.menuButton}
          onClick={() => setShowSidebar(!showSidebar)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <div className={styles.navCenter}>
          <Link
            className={`${styles.navLink} ${pathname.startsWith("/dashboard") ? styles.active : ""}`}
            href="/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className={`${styles.navLink} ${pathname.startsWith("/products") ? styles.active : ""}`}
            href="/products"
          >
            Products
          </Link>
          <Link
            className={`${styles.navLink} ${pathname.startsWith("/bookings") ? styles.active : ""}`}
            href="/bookings"
          >
            Booking
          </Link>
          <Link
            className={`${styles.navLink} ${pathname === "/profile" ? styles.active : ""}`}
            href="/profile"
          >
            Profile
          </Link>
        </div>

        <input
          className={styles.searchBox}
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </nav>

      {showSidebar && (
        <div
          className={styles.backdrop}
          onClick={() => setShowSidebar(false)}
        />
      )}

      <div className={styles.container}>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${showSidebar ? styles.open : ""}`}>
          <button
            className={`${styles.navItem} ${activeTab === "all" ? styles.sidebarActive : ""}`}
            onClick={() => {
              setActiveTab("all");
              setShowSidebar(false);
            }}
          >
            Dashboard
          </button>
          <button
            className={`${styles.navItem} ${activeTab === "homogeneous" ? styles.sidebarActive : ""}`}
            onClick={() => {
              setActiveTab("homogeneous");
              setShowSidebar(false);
            }}
          >
            Homogeneous
          </button>
          <button
            className={`${styles.navItem} ${activeTab === "heterogeneous" ? styles.sidebarActive : ""}`}
            onClick={() => {
              setActiveTab("heterogeneous");
              setShowSidebar(false);
            }}
          >
            Heterogeneous
          </button>
          <button
            className={`${styles.navItem} ${activeTab === "sports" ? styles.sidebarActive : ""}`}
            onClick={() => {
              setActiveTab("sports");
              setShowSidebar(false);
            }}
          >
            Sports
          </button>
          <button
            className={styles.navItem}
            onClick={() => {
              router.push("/profile");
              setShowSidebar(false);
            }}
          >
            Profile
          </button>
          <button className={`${styles.sidebarButton} ${styles.logout}`} onClick={handleLogout}>
            Logout
          </button>
        </aside>

        {/* Main */}
        <main className={styles.main}>
          <h1 className={styles.header}>FloorEase Dashboard</h1>

          <div className={styles.tabs}>
            {["all", "homogeneous", "heterogeneous", "sports"].map((tab) => (
              <button
                key={tab}
                className={
                  activeTab === tab
                    ? `${styles.tabButton} ${styles.activeTab}`
                    : styles.tabButton
                }
                onClick={() => setActiveTab(tab)}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          <div className={styles.cardsGrid}>
            {filteredCards.map((card) => {
              const href = routeMap[card.title];
              const clickable = Boolean(href);
              return (
                <div
                  key={card.title}
                  className={styles.card}
                  onClick={clickable ? () => router.push(href) : undefined}
                  style={clickable ? { cursor: "pointer" } : undefined}
                >
                  <div className={styles.image}>
                    {card.image === "sports" ? (
                      <div className={styles.sportsCourt}>🏀</div>
                    ) : (
                      <img className={styles.heroImage} src={card.image} alt={card.title} />
                    )}
                  </div>
                  <p className={styles.cardTitle}>{card.title}</p>
                </div>
              );
            })}
          </div>

          <section className={styles.overviewSection}>
            <div className={styles.overviewHeader}>Quick Overview</div>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Total Bookings</span>
                <div className={styles.statValue}>
                  📅 1
                </div>
                <span className={styles.statMeta}>Updated just now</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Pending Requests</span>
                <div className={styles.statValue}>
                  ⏳ 1
                </div>
                <span className={styles.statMeta}>Updated just now</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Completed Jobs</span>
                <div className={styles.statValue}>
                  ✅ 0
                </div>
                <span className={styles.statMeta}>Updated just now</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Profile Completion</span>
                <div className={styles.statValue}>
                  👤 80%
                </div>
                <span className={styles.statMeta}>Updated just now</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}