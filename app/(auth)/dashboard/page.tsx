"use client";

import { useState } from "react";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

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
      image: "//sports",
    },
  ];

  const filteredCards = cards.filter((card) => {
    const matchesTab =
      activeTab === "all" || card.category === activeTab;
    const matchesSearch =
      card.title.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <>
      {/* Top Nav */}
      <nav className={styles.topNav}>
        <div className={styles.logo}>FloorEase</div>

        <div className={styles.navCenter}>
          <a className={styles.active}>Dashboard</a>
          <a>Products</a>
          <a>Booking</a>
          <a>Profile</a>
        </div>

        <input
          className={styles.search}
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </nav>

      <div className={styles.container}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <button className={styles.active}>Dashboard</button>
          <button>Homogeneous</button>
          <button>Heterogeneous</button>
          <button>Sports</button>
          <button className={styles.logout}>Logout</button>
        </aside>

        {/* Main */}
        <main className={styles.main}>
          <h1>FloorEase Dashboard</h1>

          {/* Tabs */}
          <div className={styles.tabs}>
            {["all", "homogeneous", "heterogeneous", "sports"].map(
              (tab) => (
                <button
                  key={tab}
                  className={
                    activeTab === tab
                      ? styles.activeTab
                      : ""
                  }
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.toUpperCase()}
                </button>
              )
            )}
          </div>

          {/* Cards */}
          <div className={styles.grid}>
            {filteredCards.map((card) => (
              <div key={card.title} className={styles.card}>
                <div className={styles.image}>
                  {card.image === "sports" ? (
                    <div className={styles.sportsCourt}>🏀</div>
                  ) : (
                    <img src={card.image} alt={card.title} />
                  )}
                </div>
                <p>{card.title}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
