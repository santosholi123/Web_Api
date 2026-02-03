"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";


export default function DashboardPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [hasToken, setHasToken] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);

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
      image:
        "https://images.pexels.com/photos/7534211/pexels-photo-7534211.jpeg",
    },
    {
      title: "Heterogeneous Flooring",
      category: "heterogeneous",
      image:
        "https://images.pexels.com/photos/4483773/pexels-photo-4483773.jpeg",
    },
    {
      title: "Sports Flooring",
      category: "sports",
      image: "sports",
    },
  ];

  const filteredCards = cards.filter((card) => {
    const matchesTab =
      activeTab === "all" || card.category === activeTab;
    const matchesSearch =
      card.title.toLowerCase().includes(search.toLowerCase());
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
          <a className={`${styles.navLink} ${styles.navLinkActive}`}>Dashboard</a>
          <a className={styles.navLink}>Products</a>
          <a className={styles.navLink}>Booking</a>
          <a className={styles.navLink}>Profile</a>
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
          <button className={`${styles.sidebarButton} ${styles.sidebarActive}`}>Dashboard</button>
          <button className={styles.sidebarButton}>Homogeneous</button>
          <button className={styles.sidebarButton}>Heterogeneous</button>
          <button className={styles.sidebarButton}>Sports</button>
          <button
            className={`${styles.sidebarButton} ${styles.logout}`}
            onClick={handleLogout}
          >
            Logout
          </button>
        </aside>

        {/* Main */}
        <main className={styles.main}>
          <h1 className={styles.header}>FloorEase Dashboard</h1>

          {/* Tabs */}
          <div className={styles.tabs}>
            {['all', 'homogeneous', 'heterogeneous', 'sports'].map(
              (tab) => (
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
              )
            )}
          </div>

          {/* Cards */}
          <div className={styles.cardsGrid}>
            {filteredCards.map((card) => (
              <div key={card.title} className={styles.card}>
                <div className={styles.image}>
                  {card.image === "sports" ? (
                    <div className={styles.sportsCourt}>🏀</div>
                  ) : (
                    <img className={styles.heroImage} src={card.image} alt={card.title} />
                  )}
                </div>
                <p className={styles.cardTitle}>{card.title}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}