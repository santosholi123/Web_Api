"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./products.module.css";

type CategoryKey = "All" | "Homogeneous" | "Heterogeneous" | "Sports";

type ProductCard = {
  title: string;
  category: Exclude<CategoryKey, "All">;
  image: string;
};

const cards: ProductCard[] = [
  {
    title: "Homogeneous Flooring",
    category: "Homogeneous",
    image: "https://images.pexels.com/photos/7534211/pexels-photo-7534211.jpeg",
  },
  {
    title: "Heterogeneous Flooring",
    category: "Heterogeneous",
    image: "https://images.pexels.com/photos/4483773/pexels-photo-4483773.jpeg",
  },
  {
    title: "Sports Flooring",
    category: "Sports",
    image: "sports",
  },
];

const tabs: CategoryKey[] = ["All", "Homogeneous", "Heterogeneous", "Sports"];

export default function ProductsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CategoryKey>("All");
  const routeMap: Record<string, string> = {
    "Homogeneous Flooring": "/products/homogeneous",
    "Heterogeneous Flooring": "/products/heterogeneous",
    "Sports Flooring": "/products/sports",
  };

  const filteredCards = useMemo(() => {
    if (activeTab === "All") return cards;
    return cards.filter((card) => card.category === activeTab);
  }, [activeTab]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Products</h1>
        <p className={styles.subtitle}>Explore flooring categories and options.</p>
      </header>

      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={
              activeTab === tab
                ? `${styles.tabButton} ${styles.activeTab}`
                : styles.tabButton
            }
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <section className={styles.cardsGrid}>
        {filteredCards.map((card) => {
          const href = routeMap[card.title];
          const clickable = Boolean(href);
          return (
            <article
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
            </article>
          );
        })}
      </section>

      <div className={styles.bottomActions}>
        <Link className={styles.leftButton} href="/dashboard">
          Go to Dashboard
        </Link>
        <Link className={styles.rightButton} href="/bookings">
          Booking
        </Link>
      </div>
    </div>
  );
}
