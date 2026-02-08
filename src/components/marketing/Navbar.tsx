"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useUser } from "@clerk/nextjs";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { user, isLoaded } = useUser();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100 && !isScrolled) {
      setIsScrolled(true);
    } else if (latest <= 50 && isScrolled) {
      setIsScrolled(false);
    }
  });

  return (
    <>
      {/* Top Banner: "Weavy is now a part of Figma" */}
      <div
        className="fixed top-0 left-0 right-0 flex items-center justify-center"
        style={{
          zIndex: 999,
          backgroundColor: "#0e0e13",
          color: "var(--brand--base--white, white)",
          height: "3.40278rem",
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{ gap: "0.5rem" }}
        >
          {/* Figma logo inline SVG */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 38 57"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ flexShrink: 0 }}
          >
            <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
            <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
            <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
            <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
            <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
          </svg>
          {/* × separator */}
          <span className="text-white/60" style={{ fontSize: "0.8rem" }}>×</span>
          {/* Weavy W icon inline SVG */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ flexShrink: 0 }}
          >
            <rect x="2" y="2" width="5" height="16" rx="1" fill="white"/>
            <rect x="9.5" y="2" width="5" height="20" rx="1" fill="white"/>
            <rect x="17" y="2" width="5" height="16" rx="1" fill="white"/>
          </svg>
          <span
            className="text-white font-bold"
            style={{ fontSize: "0.972rem" }}
          >
            Weavy is now a part of Figma
          </span>
        </div>
      </div>

      {/* Navbar Left — Logo (fixed, blend-mode difference) */}
      <div
        className="fixed left-0 overflow-clip hidden md:block"
        style={{
          zIndex: 999,
          mixBlendMode: "difference",
          width: "50%",
          top: "3.40278rem",
        }}
      >
        <Link href="/" className="flex items-center justify-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://cdn.prod.website-files.com/6656d22b65e6a0460e391ef5/682350d42a7c97b440a58480_Nav%20left%20item%20-%20DESKTOP.svg"
            alt="Weavy"
            style={{
              height: isScrolled ? "40px" : "54px",
              transition: "height 0.3s cubic-bezier(.25,.46,.45,.94)",
            }}
          />
        </Link>
      </div>

      {/* Mobile logo */}
      <div
        className="fixed left-0 overflow-clip md:hidden"
        style={{
          zIndex: 999,
          mixBlendMode: "difference",
          top: "3.40278rem",
        }}
      >
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://cdn.prod.website-files.com/6656d22b65e6a0460e391ef5/682b76283538127bf3907ded_Frame%20427321089.svg"
            alt="Weavy"
            style={{ height: "40px" }}
          />
        </Link>
      </div>

      {/* Navbar Right — Links + Start Now (fixed, blend-mode difference) */}
      <div
        className="fixed right-0 overflow-clip hidden md:flex"
        style={{
          zIndex: 998,
          mixBlendMode: "difference",
          top: "3.40278rem",
          gap: "8px",
          flexFlow: "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          height: "fit-content",
        }}
      >
        {/* Nav Links */}
        <nav
          className="flex items-center"
          style={{ gap: "0.25rem", paddingTop: "4px" }}
        >
          {[
            { label: "COLLECTIVE", href: "#" },
            { label: "ENTERPRISE", href: "#" },
            { label: "PRICING", href: "#" },
            { label: "REQUEST A DEMO", href: "#" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="nav-text-link"
              style={{
                backgroundColor: "transparent",
                color: "#fff",
                letterSpacing: "0.15px",
                textTransform: "uppercase" as const,
                borderRadius: "4px",
                padding: "6px 10px",
                fontSize: "12px",
                lineHeight: 1,
                textDecoration: "none",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--brand--base--white, #fff)";
                e.currentTarget.style.color =
                  "var(--brand--rich-black, #252525)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#fff";
              }}
            >
              {link.label}
            </Link>
          ))}
          {isLoaded && user ? (
            <Link
              href="/dashboard"
              className="nav-text-link"
              style={{
                backgroundColor: "transparent",
                color: "#fff",
                letterSpacing: "0.15px",
                textTransform: "uppercase" as const,
                borderRadius: "4px",
                padding: "6px 10px",
                fontSize: "12px",
                lineHeight: 1,
                textDecoration: "none",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--brand--base--white, #fff)";
                e.currentTarget.style.color =
                  "var(--brand--rich-black, #252525)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#fff";
              }}
            >
              {user.firstName ||
                user.username ||
                user.primaryEmailAddress?.emailAddress?.split("@")[0] ||
                "DASHBOARD"}
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className="nav-text-link"
              style={{
                backgroundColor: "transparent",
                color: "#fff",
                letterSpacing: "0.15px",
                textTransform: "uppercase" as const,
                borderRadius: "4px",
                padding: "6px 10px",
                fontSize: "12px",
                lineHeight: 1,
                textDecoration: "none",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--brand--base--white, #fff)";
                e.currentTarget.style.color =
                  "var(--brand--rich-black, #252525)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#fff";
              }}
            >
              SIGN IN
            </Link>
          )}
        </nav>

        {/* "Start Now" CTA — huge_nav-button */}
        <Link
          href={isLoaded && user ? "/dashboard" : "/sign-up"}
          className="select-none active:scale-95"
          style={{
            backgroundColor: "var(--brand--lemon, #f7ff9e)",
            color: "var(--brand--base--black, #000)",
            borderBottomLeftRadius: "8px",
            padding: isScrolled
              ? "6px 1rem 0.4rem 0.7rem"
              : "10px 1.69167rem 0.55rem 0.886111rem",
            fontSize: isScrolled ? "1.5rem" : "2.77778rem",
            lineHeight: 1,
            textDecoration: "none",
            transition: "all 0.2s cubic-bezier(.25,.46,.45,.94)",
            whiteSpace: "nowrap" as const,
            fontWeight: 400,
            WebkitFontSmoothing: "antialiased" as const,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              "var(--brand--rich-black, #252525)";
            e.currentTarget.style.color = "#f4f4f4";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor =
              "var(--brand--lemon, #f7ff9e)";
            e.currentTarget.style.color = "var(--brand--base--black, #000)";
          }}
        >
          Start Now
        </Link>
      </div>

      {/* Mobile: hamburger + Start Now */}
      <div
        className="fixed right-0 flex items-start md:hidden"
        style={{
          zIndex: 998,
          top: "3.40278rem",
          gap: "4px",
        }}
      >
        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-1 p-2 mt-1"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          style={{ mixBlendMode: "difference" }}
        >
          <span
            className={`block w-5 h-0.5 bg-white transition-transform duration-200 ${mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-opacity duration-200 ${mobileMenuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-transform duration-200 ${mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
          />
        </button>

        {/* Mobile Start Now */}
        <Link
          href={isLoaded && user ? "/dashboard" : "/sign-up"}
          className="select-none"
          style={{
            backgroundColor: "var(--brand--lemon, #f7ff9e)",
            color: "var(--brand--base--black, #000)",
            borderBottomLeftRadius: "8px",
            padding: "8px 12px 6px 8px",
            fontSize: "1.4rem",
            lineHeight: 1,
            textDecoration: "none",
            fontWeight: 400,
          }}
        >
          Start Now
        </Link>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed left-0 right-0 md:hidden"
          style={{
            zIndex: 997,
            top: "calc(3.40278rem + 48px)",
            backgroundColor: "rgba(14, 14, 19, 0.95)",
            backdropFilter: "blur(12px)",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            padding: "1rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {["COLLECTIVE", "ENTERPRISE", "PRICING", "REQUEST A DEMO"].map(
            (label) => (
              <Link
                key={label}
                href="#"
                className="text-sm font-semibold text-white/70 uppercase tracking-widest hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            )
          )}
          {isLoaded && user ? (
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-white/70 uppercase tracking-widest hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              DASHBOARD
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className="text-sm font-semibold text-white/70 uppercase tracking-widest hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              SIGN IN
            </Link>
          )}
        </motion.div>
      )}
    </>
  );
}
