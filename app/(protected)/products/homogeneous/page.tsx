"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./homogeneous.module.css";

type Feature = {
  title: string;
  description: string;
  icon: string;
};

type InfoCard = {
  title: string;
  description: string;
};

const features: Feature[] = [
  { title: "Durability", description: "Built for heavy traffic zones.", icon: "🛡️" },
  { title: "Maintenance", description: "Easy cleaning and care.", icon: "🧼" },
  { title: "Slip Resistance", description: "Stable footing in motion.", icon: "🦶" },
  { title: "Chemical Resistance", description: "Resists everyday spills.", icon: "🧪" },
  { title: "Fire Safety", description: "Engineered for safety.", icon: "🔥" },
  { title: "Hygienic", description: "Seamless, germ-resistant.", icon: "🧴" },
  { title: "Easy Installation", description: "Fast, efficient fit.", icon: "🧩" },
  { title: "Eco-Friendly", description: "Responsible material choices.", icon: "🌿" },
];

const wellnessCards: InfoCard[] = [
  { title: "Composition", description: "PVC with stabilizers." },
  { title: "Recycled Content", description: "Up to 30% pre-consumer." },
  { title: "Indoor Air Quality", description: "Low emissions." },
  { title: "Recyclable", description: "Designed for circularity." },
  { title: "Low VOC", description: "Ultra-low VOC profile." },
  { title: "Wellness", description: "Supports healthier spaces." },
];

const swatches = [
  {
    code: "FE-25024",
    image:
      "https://5.imimg.com/data5/OV/ND/GO/SELLER-2156888/hospital-flooring.jpg",
  },
  {
    code: "FE-25034",
    image:
      "https://www.greatmats.com/images/lonseal/loneco-topseal-install-12.jpg.webp",
  },
  {
    code: "FE-25047",
    image:
      "https://www.firstpointflooring.co.uk/hubfs/benefits-of-an-optimal-industrial-linoleum-flooring-for-hospitals.jpg",
  },
  {
    code: "FE-25058",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr3cbrYpo525IfQfhCT5h8Gvq1J8CLlaENAQ&s",
  },
  {
    code: "FE-25063",
    image:
      "https://www.constructionspecifier.com/wp-content/uploads/2024/08/online-Lino_HE_056_625_911_RS_HR.jpg",
  },
  {
    code: "FE-25070",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-Vr--GGXxLdlY2vY_EKVG6ajDc4TssiXbDg&s",
  },
];

const specs = [
  { description: "Type", standard: "EN 649", unit: "-", result: "Homogeneous vinyl" },
  { description: "Total thickness", standard: "EN 428", unit: "mm", result: "2.0" },
  { description: "Width", standard: "EN 426", unit: "m", result: "2.0" },
  { description: "Length", standard: "EN 426", unit: "m", result: "20" },
  { description: "Weight", standard: "EN 430", unit: "kg/m²", result: "2.9" },
  { description: "Fire rating", standard: "EN 13501-1", unit: "-", result: "Bfl-s1" },
  { description: "Slip resistance (dry)", standard: "DIN 51130", unit: "-", result: "R9" },
  { description: "Slip resistance (wet)", standard: "EN 13893", unit: "-", result: "DS" },
  { description: "Electrical resistance", standard: "EN 1815", unit: "kV", result: "≤ 2" },
  { description: "Hygiene", standard: "ISO 846", unit: "-", result: "Anti-bacterial" },
  { description: "Surface treatment", standard: "Factory", unit: "-", result: "PUR" },
  { description: "Dimensional stability", standard: "EN 434", unit: "%", result: "≤ 0.4" },
];

const advantages = [
  { label: "Eco Friendly", icon: "🌿" },
  { label: "Easy Maintenance", icon: "🧼" },
  { label: "Wear Resistant", icon: "🛡️" },
  { label: "Anti Slip", icon: "🦶" },
  { label: "Sound Absorbing", icon: "🔈" },
  { label: "Anti Bacterial", icon: "🧴" },
];

const applications = [
  { label: "Healthcare", icon: "🏥" },
  { label: "Education", icon: "🎓" },
  { label: "Office", icon: "🏢" },
  { label: "Shopping Mall", icon: "🛍️" },
  { label: "Transportation", icon: "🚇" },
  { label: "Factories", icon: "🏭" },
];

export default function HomogeneousFlooringPage() {
  const router = useRouter();
  const [selectedSwatch, setSelectedSwatch] = useState(swatches[0].code);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  const swatchLabel = useMemo(() => `Selected: ${selectedSwatch}`, [selectedSwatch]);

  return (
    <div className={styles.page}>
      <main className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroOverlay}>
            <h1 className={styles.heroTitle}>Homogeneous Flooring</h1>
            <p className={styles.heroSubtitle}>
              Homogeneous vinyl flooring delivers unified composition for long-lasting
              performance, easy upkeep, and refined aesthetics across high-traffic spaces.
            </p>
            <div className={styles.heroActions}>
              <Link className={styles.secondaryButton} href="/products">
                Back to Products
              </Link>
              <Link className={styles.primaryButton} href="/bookings">
                Book Now
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="feature-grid">
          <header className={styles.sectionHeader}>
            <h2 id="feature-grid">Core Features</h2>
            <p>Performance-driven details for demanding environments.</p>
          </header>
          <div className={styles.featureGrid}>
            {features.map((feature) => (
              <article key={feature.title} className={styles.featureCard}>
                <span className={styles.featureIcon} aria-hidden="true">
                  {feature.icon}
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="color-palette">
          <header className={styles.sectionHeader}>
            <h2 id="color-palette">Color Palette</h2>
            <p>Select a shade that complements your space.</p>
          </header>
          <div className={styles.paletteLayout}>
            <figure className={styles.paletteImageCard}>
              <img
                src="https://www.greatmats.com/images/lonseal/loneco-topseal-install-12.jpg.webp"
                alt="Commercial homogeneous vinyl flooring installation"
              />
              <figcaption>Crafted to match timeless aesthetics</figcaption>
            </figure>
            <div className={styles.swatchPanel}>
              <p className={styles.swatchLabel}>{swatchLabel}</p>
              <div className={styles.swatchList} role="list">
                {swatches.map((swatch) => (
                  <button
                    key={swatch.code}
                    type="button"
                    role="listitem"
                    className={`${styles.swatchRow} ${
                      swatch.code === selectedSwatch ? styles.swatchRowSelected : ""
                    }`}
                    onClick={() => setSelectedSwatch(swatch.code)}
                    aria-pressed={swatch.code === selectedSwatch}
                  >
                    <img
                      className={styles.swatchImage}
                      src={swatch.image}
                      alt={`${swatch.code} flooring texture`}
                    />
                    <span className={styles.swatchCode}>{swatch.code}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="wellness">
          <div className={styles.stripHeader}>
            <h2 id="wellness">FEWER VOCs • BETTER INDOOR AIR QUALITY</h2>
          </div>
          <div className={styles.wellnessGrid}>
            {wellnessCards.map((card) => (
              <article key={card.title} className={styles.wellnessCard}>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="structure">
          <header className={styles.sectionHeader}>
            <h2 id="structure">Product Structure</h2>
            <p>Layered engineering that supports daily performance.</p>
          </header>
          <div className={styles.structureLayout}>
            <ul className={styles.calloutList}>
              <li>
                <strong>PUR Protect</strong>
                <span>Enhanced scratch and stain resistance.</span>
              </li>
              <li>
                <strong>Compact Core</strong>
                <span>Dense, uniform construction for stability.</span>
              </li>
              <li>
                <strong>Gridded Back</strong>
                <span>Improved adhesion and fit.</span>
              </li>
              <li>
                <strong>Texture Design</strong>
                <span>Natural pattern depth and feel.</span>
              </li>
              <li>
                <strong>Plasticizer DOTP</strong>
                <span>Low-odor, safer plasticizer choice.</span>
              </li>
            </ul>
            <div className={styles.structureImage}>
              <img
                src="https://www.firstpointflooring.co.uk/hubfs/benefits-of-an-optimal-industrial-linoleum-flooring-for-hospitals.jpg"
                alt="Industrial homogeneous linoleum hospital flooring"
              />
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="specs">
          <header className={styles.sectionHeader}>
            <h2 id="specs">Specifications</h2>
            <p>Technical performance aligned with industry standards.</p>
          </header>
          <div className={styles.tableWrap}>
            <table className={styles.specsTable}>
              <thead>
                <tr>
                  <th scope="col">Description</th>
                  <th scope="col">Standard</th>
                  <th scope="col">Unit</th>
                  <th scope="col">Result</th>
                </tr>
              </thead>
              <tbody>
                {specs.map((row) => (
                  <tr key={row.description}>
                    <td>{row.description}</td>
                    <td>{row.standard}</td>
                    <td>{row.unit}</td>
                    <td>{row.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="adv-app">
          <header className={styles.sectionHeader}>
            <h2 id="adv-app">Advantages & Applications</h2>
            <p>Where Homogeneous Flooring excels.</p>
          </header>
          <div className={styles.dualGrid}>
            <article className={styles.pillPanel}>
              <h3>Advantages</h3>
              <div className={styles.pillGrid}>
                {advantages.map((item) => (
                  <span key={item.label} className={styles.pill}>
                    <span aria-hidden="true">{item.icon}</span>
                    {item.label}
                  </span>
                ))}
              </div>
            </article>
            <article className={styles.pillPanel}>
              <h3>Applications</h3>
              <div className={styles.pillGrid}>
                {applications.map((item) => (
                  <span key={item.label} className={styles.pill}>
                    <span aria-hidden="true">{item.icon}</span>
                    {item.label}
                  </span>
                ))}
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
