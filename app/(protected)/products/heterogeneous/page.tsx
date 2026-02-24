"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./heterogeneous.module.css";

type Feature = {
  title: string;
  description: string;
  icon: string;
};

type InfoCard = {
  title: string;
  description: string;
};

type SpecRow = {
  description: string;
  standard: string;
  unit: string;
  result: string;
};

const features: Feature[] = [
  { title: "Durable Wear Layer", description: "Built for heavy traffic wear.", icon: "🛡️" },
  { title: "Easy Maintenance", description: "Simple cleaning routines.", icon: "🧼" },
  { title: "Slip Resistance", description: "Confident footing daily.", icon: "🦶" },
  { title: "Chemical Resistance", description: "Resists common spills.", icon: "🧪" },
  { title: "Hygienic Surface", description: "Seamless, clean finish.", icon: "🧴" },
  { title: "Modern Design Range", description: "Versatile patterns & tones.", icon: "🎨" },
];

const wellnessCards: InfoCard[] = [
  { title: "Composition", description: "Low VOC formulation." },
  { title: "Recycled Content", description: "Material reuse focused." },
  { title: "Indoor Air Quality", description: "Cleaner interior environments." },
];

const swatches = [
  {
    code: "HE-24011",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb6cKShob2fFT1kudM9Yqn2Q8Ma_riwrH74w&s",
  },
  {
    code: "HE-24022",
    image:
      "https://www.responsiveindustries.com/wp-content/uploads/2019/03/SPRQ-12_ArcticAzure-full.jpg",
  },
  {
    code: "HE-24033",
    image:
      "https://ecdn6.globalso.com/upload/p/3884/image_product/2025-04/67f87d90e222632889.jpg",
  },
  {
    code: "HE-24044",
    image:
      "https://d2yrl9qa73wml8.cloudfront.net/Y15966O0N/conversions/Vinyl-Flooring1-size_500_500.webp",
  },
  {
    code: "HE-24055",
    image:
      "https://ecdn6.globalso.com/upload/p/3884/image_product/2025-04/67f87d90e222632889.jpg",
  },
  {
    code: "HE-24066",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjKiEgh2brEf5-G6DGryPRDlrqhh1thRHpYw&s",
  },
];

const specs: SpecRow[] = [
  { description: "Total thickness", standard: "EN 428", unit: "mm", result: "2.0" },
  { description: "Wear layer thickness", standard: "EN 429", unit: "mm", result: "0.7" },
  { description: "Commercial use", standard: "EN 685", unit: "-", result: "Class 34" },
  { description: "Industrial use", standard: "EN 685", unit: "-", result: "Class 43" },
  { description: "Roll width", standard: "EN 426", unit: "m", result: "2.0" },
  { description: "Roll length", standard: "EN 426", unit: "m", result: "≤ 25" },
  { description: "Total weight", standard: "EN 430", unit: "g/m²", result: "ca. 2750" },
  { description: "Dimensional stability", standard: "EN 434", unit: "%", result: "≤ 0.20" },
  { description: "Residual indentation", standard: "EN 433", unit: "mm", result: "≤ 0.10" },
  { description: "Castor chair (continuous use)", standard: "EN 425", unit: "-", result: "Pass" },
  { description: "Light fastness", standard: "EN ISO 105-B02", unit: "-", result: "≥ 6" },
  { description: "Flexibility", standard: "EN 435", unit: "ø mm", result: "10" },
  { description: "Chemical resistance", standard: "EN 423", unit: "-", result: "Very good" },
  { description: "Slip resistance (DIN 51130)", standard: "DIN 51130", unit: "-", result: "R10" },
  { description: "Reaction to fire (EN 13501-1)", standard: "EN 13501-1", unit: "-", result: "Bfl-s1" },
  { description: "Slip resistance (EN 13893)", standard: "EN 13893", unit: "μ", result: "≥ 0.30" },
  { description: "Body voltage (EN 1815)", standard: "EN 1815", unit: "kV", result: "≤ 2" },
  { description: "Thermal conductivity", standard: "EN 12667", unit: "W/m·K", result: "0.25" },
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

export default function HeterogeneousFlooringPage() {
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
            <h1 className={styles.heroTitle}>Heterogeneous Flooring</h1>
            <p className={styles.heroSubtitle}>
              Heterogeneous vinyl flooring combines multi-layer construction with design
              versatility, dependable durability, and easy care for hospitals, schools,
              and commercial interiors.
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
            <h2 id="feature-grid">Key Features</h2>
            <p>Balanced performance and design flexibility for busy spaces.</p>
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
            <p>Choose finishes that align with your project aesthetic.</p>
          </header>
          <div className={styles.paletteLayout}>
            <figure className={styles.paletteImageCard}>
              <img
                src="https://5459421560497320-1725335663568-2549533.cdn.site.joinf.com/5459421560497320/532nmQ5Ctw.jpg"
                alt="Commercial heterogeneous flooring interior"
              />
              <figcaption>Crafted for layered design versatility</figcaption>
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
            <h2 id="wellness">FEWER VOC'S • INDOOR AIR QUALITY</h2>
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
            <p>Where Heterogeneous Flooring excels.</p>
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
