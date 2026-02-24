"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./sports.module.css";
import homogeneousStyles from "../homogeneous/homogeneous.module.css";

type Feature = {
	title: string;
	description: string;
	icon: string;
};

type PerformanceRow = {
	description: string;
	method: string;
	result45: string;
	result65: string;
};

const features: Feature[] = [
	{ title: "Shock Absorption", description: "Cushioned layers reduce impact.", icon: "🧘" },
	{ title: "Slip Resistance", description: "Stable grip under motion.", icon: "🦶" },
	{ title: "Seamless Finish", description: "Clean, unified surface.", icon: "✨" },
	{ title: "Easy Maintenance", description: "Simple daily upkeep.", icon: "🧼" },
	{ title: "Durability", description: "Built for heavy use.", icon: "🛡️" },
	{ title: "Ball Bounce Consistency", description: "Reliable play response.", icon: "🏀" },
	{ title: "Noise Reduction", description: "Lower impact sound.", icon: "🔇" },
	{ title: "Athlete Safety", description: "Supportive, safe footing.", icon: "🧑‍🤝‍🧑" },
];

const featureList = [
	"Durable surface for high-impact activities",
	"Shock absorption reduces injuries",
	"Anti-slip texture for safety",
	"Easy maintenance and cleaning",
	"Moisture and stain resistance",
	"Seamless and hygienic installation",
];

const advantages = [
	"Improves athletic performance",
	"Reduces long-term maintenance cost",
	"Customizable thickness and finish",
	"Suitable for indoor and outdoor sports",
	"Long lifespan with high traffic tolerance",
];

const performanceRows: PerformanceRow[] = [
	{
		description: "Thickness",
		method: "EN 428",
		result45: "4.50 mm",
		result65: "6.50 mm",
	},
	{
		description: "Roll Dimension",
		method: "EN 426",
		result45: "1.8 mtr × 15 linear mtr",
		result65: "1.8 mtr × 15 linear mtr",
	},
	{
		description: "Total Weight",
		method: "EN 430",
		result45: "3.3 kg/sq.m",
		result65: "4.3 kg/sq.m",
	},
	{
		description: "Thickness of Wear Layer",
		method: "EN 429",
		result45: "0.70 mm",
		result65: "1.00 mm",
	},
	{
		description: "Dimensional Stability",
		method: "EN 434",
		result45: "≤ 0.10%",
		result65: "≤ 0.10%",
	},
	{
		description: "Residual Indentation After Static Load",
		method: "EN 433",
		result45: "≤ 0.40 mm",
		result65: "≤ 0.40 mm",
	},
	{
		description: "Flexibility",
		method: "EN 435",
		result45: "20 mm Mandrel, Passed",
		result65: "20 mm Mandrel, Passed",
	},
	{
		description: "Abrasion Resistance",
		method: "EN 660-2",
		result45: "Wear Group T",
		result65: "Wear Group T",
	},
	{
		description: "Slip Resistance",
		method: "DIN 51130",
		result45: "R9",
		result65: "R9",
	},
	{
		description: "Resistance to Chemicals",
		method: "EN 423",
		result45: "No Visible Change",
		result65: "No Visible Change",
	},
	{
		description: "Sound Absorption",
		method: "ISO 140-8 / EN ISO 717-2",
		result45: "ΔLW = 18 dB",
		result65: "ΔLW = 24 dB",
	},
	{
		description: "Surface Protection",
		method: "—",
		result45: "PUR",
		result65: "PUR",
	},
];

const heroImages = [
	{
		src: "https://reliableflooring.com.np/images/uploads/tennisflooring.png",
		alt: "Indoor sports court flooring",
	},
	{
		src: "https://media.tarkett-image.com/medium/IN_HP_Multiflex_M_8772001_8772002_002.jpg",
		alt: "Sports flooring surface with court lines",
	},
	{
		src: "https://i0.wp.com/summit-flooring.com/wp-content/uploads/2023/02/Muscle_Install.webp?fit=2560%2C1920&ssl=1",
		alt: "Gym sports flooring texture",
	},
];

export default function SportsFlooringPage() {
	const router = useRouter();

	useEffect(() => {
		const token = window.localStorage.getItem("token");
		if (!token) {
			router.replace("/login");
		}
	}, [router]);

	return (
		<div className={styles.page}>
			<main className={styles.container}>
				<section className={styles.hero}>
					<div className={styles.heroOverlay}>
						<div className={styles.heroGrid}>
							<div className={styles.heroText}>
								<h1 className={styles.heroTitle}>Sports Flooring</h1>
								<p className={styles.heroSubtitle}>
									Designed for indoor courts, gyms, and multipurpose halls, sports
									flooring delivers durability, slip resistance, and shock absorption
									to support athlete safety and performance.
								</p>
								<div className={homogeneousStyles.heroActions}>
									<button
										type="button"
										className={homogeneousStyles.secondaryButton}
										onClick={() => router.push("/dashboard")}
									>
										← Back to Dashboard
									</button>
									<button
										type="button"
										className={homogeneousStyles.primaryButton}
										onClick={() => router.push("/bookings")}
									>
										Go to Booking
									</button>
								</div>
							</div>
							<div className={styles.heroImages}>
								<div className={styles.heroImageTall}>
									<img src={heroImages[0].src} alt={heroImages[0].alt} />
								</div>
								<div className={styles.heroImageStack}>
									<div className={styles.heroImageSmall}>
										<img src={heroImages[1].src} alt={heroImages[1].alt} />
									</div>
									<div className={styles.heroImageSmall}>
										<img src={heroImages[2].src} alt={heroImages[2].alt} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className={styles.section} aria-labelledby="feature-grid">
					<header className={styles.sectionHeader}>
						<h2 id="feature-grid">Key Features</h2>
						<p>Performance-driven features built for high-impact activities.</p>
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

				<section className={styles.section} aria-labelledby="sports-features">
					<header className={styles.sectionHeader}>
						<h2 id="sports-features">Features of Sports Flooring</h2>
						<p>Balanced performance and protection for active environments.</p>
					</header>
					<div className={styles.featuresLayout}>
						<article className={styles.listCard}>
							<div className={styles.featureList}>
								{featureList.map((item) => (
									<span key={item} className={styles.featurePill}>
										{item}
									</span>
								))}
							</div>
						</article>
						<figure className={styles.featureImageCard}>
							<img
								src="https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg"
								alt="Indoor sports court flooring"
							/>
						</figure>
					</div>
				</section>

				<section className={styles.section} aria-labelledby="advantages">
					<article className={styles.advantagesCard}>
						<h2 id="advantages">Advantages</h2>
						<div className={styles.advantageList}>
							{advantages.map((item) => (
								<span key={item} className={styles.advantageItem}>
									{item}
								</span>
							))}
						</div>
					</article>
				</section>

				<section className={styles.section} aria-labelledby="performance">
					<header className={styles.sectionHeaderCentered}>
						<h2 id="performance">Performance Characteristics</h2>
					</header>
					<div className={styles.tableWrap}>
						<table className={styles.specsTable}>
							<thead>
								<tr>
									<th scope="col">Description</th>
									<th scope="col">Test Method</th>
									<th scope="col">Results 4.5 mm</th>
									<th scope="col">Results 6.5 mm</th>
								</tr>
							</thead>
							<tbody>
								{performanceRows.map((row) => (
									<tr key={row.description}>
										<td>{row.description}</td>
										<td>{row.method}</td>
										<td>{row.result45}</td>
										<td>{row.result65}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
			</main>
		</div>
	);
}

