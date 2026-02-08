"use client";

import HeroWorkflow from "@/components/marketing/HeroWorkflow";
import MobileHeroCards from "@/components/marketing/MobileHeroCards";

/**
 * Hero Section — pixel-perfect match to real weavy.ai.
 * Uses CSS classes from globals.css (.section-hero, .hero-grid, etc.)
 * Desktop: ReactFlow interactive canvas (from WavyxGalaxy reference)
 * Mobile: Vertical card layout
 */
export default function HeroSection() {
  return (
    <section className="section-hero">
      <div className="hero-grid">
        {/* "Weavy" heading — left 6 columns */}
        <div className="h1-wrapper" style={{ gridColumn: "span 6" }}>
          <h1 className="heading_h1-hero">Weavy</h1>
        </div>

        {/* "Artistic Intelligence" + description — right 6 columns */}
        <div className="vertical-wrapp" style={{ gridColumn: "span 6" }}>
          <div className="h1-wrapper extra-bot-pad">
            <h1 className="heading_h1-hero">Artistic Intelligence</h1>
          </div>
          <div className="paragraph-wrapper">
            <p className="text-size-large">
              Turn your creative vision into scalable workflows. Access all AI
              models and professional editing tools in one node based platform.
            </p>
          </div>
        </div>

        {/* Desktop: ReactFlow interactive workflow */}
        <div className="hidden md:block" style={{ gridColumn: "1 / -1" }}>
          <div className="hero-cards-area" style={{ display: "block", padding: 0, overflow: "visible" }}>
            <div className="relative w-full" style={{ height: "38em" }}>
              <HeroWorkflow />
            </div>
          </div>
        </div>

        {/* Mobile card layout */}
        <div className="md:hidden" style={{ gridColumn: "1 / -1" }}>
          <MobileHeroCards />
        </div>
      </div>
    </section>
  );
}
